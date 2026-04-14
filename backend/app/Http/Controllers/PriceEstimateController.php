<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class PriceEstimateController extends Controller
{
    private const MIN_CONFIDENCE = 0.65;
    private const MIN_COMPS_HIGH = 20;
    private const MIN_COMPS_MED  = 5;

    private const LOCAL_KEYWORDS = [
        'handicraft','souvenir','spice','carpet','leather','ceramics',
        'artisanat','marché','bazaar','tea','argan','street food',
    ];

    private const CATALOGABLE_KEYWORDS = [
        'electronics','smartphone','laptop','tablet','camera',
        'headphones','sneakers','perfume','watch','clothing',
    ];

    // ─── POST /api/estimate ───────────────────────────────────
    public function estimate(Request $request): JsonResponse
    {
        $v = $request->validate([
            'image'          => ['required','image','max:4096'],
            'country'        => ['nullable','string','max:80'],
            'city'           => ['nullable','string','max:80'],
            'condition'      => ['nullable','string','in:new,used'],
            'market_context' => ['nullable','string','in:souk,modern'],
            'currency'       => ['nullable','string','max:5'],
        ]);

        $country   = $v['country']        ?? 'Morocco';
        $city      = $v['city']           ?? null;
        $condition = $v['condition']      ?? 'new';
        $context   = $v['market_context'] ?? 'souk';
        $currency  = strtoupper($v['currency'] ?? $this->defaultCurrency($country));
        $apiKey    = config('services.groq.key');

        if (!$apiKey) {
            return response()->json(['status' => 'ERROR', 'message' => 'API key missing'], 500);
        }

        // Encode image
        $file    = $request->file('image');
        $mime    = $file->getMimeType() ?: 'image/jpeg';
        $dataUrl = 'data:'.$mime.';base64,'.base64_encode(file_get_contents($file->getRealPath()));

        // ── Phase A: Identification ──────────────────────────
        $ident = $this->callGroq($apiKey, $this->identPrompt($country, $city, $context), $dataUrl);
        if (!$ident) {
            return response()->json(['status' => 'ERROR', 'message' => 'Vision API failed'], 502);
        }

        $confIdent   = (float) ($ident['confidence_identification'] ?? 0.0);
        $name        = trim((string) ($ident['name']     ?? ''));
        $category    = strtolower(trim((string) ($ident['category'] ?? '')));
        $brand       = trim((string) ($ident['brand']    ?? ''));
        $model       = trim((string) ($ident['model']    ?? ''));
        $variant     = trim((string) ($ident['variant']  ?? ''));
        $missingInfo = $ident['missing_info'] ?? null;

        if ($confIdent < self::MIN_CONFIDENCE) {
            return response()->json([
                'status'                    => 'INSUFFICIENT_DATA',
                'confidence_identification' => $confIdent,
                'missing_info'              => $missingInfo ?? 'Image unclear. Please add a label or barcode photo.',
                'hint'                      => 'Take a clearer photo showing the label, tag, or barcode.',
            ]);
        }

        // ── Phase B: Strategy ────────────────────────────────
        $strategy = $this->strategy($category, $context);
        $query    = trim("$brand $model $variant $name");

        // ── Phase C: Crowd comps (DB) ─────────────────────────
        $comps = $this->crowdComps($category, $country, $city, $currency);

        // ── Phase D: AI comps (fallback / supplement) ─────────
        if (count($comps) < self::MIN_COMPS_MED) {
            $aiComps = $this->aiComps($apiKey, $dataUrl, $query, $country, $city, $condition, $context, $currency);
            $comps   = array_merge($comps, $aiComps);
        }

        if (empty($comps)) {
            return response()->json([
                'status'   => 'NO_MARKET_DATA',
                'product'  => $name,
                'category' => $category,
                'message'  => 'No price data available for this item.',
            ]);
        }

        // ── Phase E: Stats ────────────────────────────────────
        $stats = $this->stats($comps);

        // ── Log ───────────────────────────────────────────────
        $this->log([
            'status' => 'OK', 'product_name' => $name, 'category' => $category,
            'brand' => $brand, 'model' => $model, 'variant' => $variant,
            'condition' => $condition, 'market_context' => $context,
            'country' => $country, 'city' => $city, 'currency_code' => $currency,
            'price_median' => $stats['median'], 'price_min' => $stats['min'],
            'price_max' => $stats['max'], 'confidence_identification' => $confIdent,
            'confidence_price' => $stats['conf'], 'evidence_count' => $stats['n'],
            'strategy' => $strategy,
        ]);

        return response()->json([
            'status' => 'OK',
            'identified_product' => [
                'name' => $name, 'brand' => $brand, 'model' => $model, 'variant' => $variant,
            ],
            'market' => [
                'country' => $country, 'city' => $city,
                'condition' => $condition, 'market_context' => $context,
            ],
            'pricing' => [
                'price_median'    => round($stats['median'],    2),
                'price_suggested' => round($stats['suggested'], 2),
                'price_min'       => round($stats['min'],       2),
                'price_max'       => round($stats['max'],       2),
                'currency'        => $this->currencyInfo($currency),
            ],
            'meta' => [
                'confidence_identification' => round($confIdent,       2),
                'confidence_price'          => round($stats['conf'],   2),
                'evidence_count'            => $stats['n'],
                'strategy'                  => $strategy,
                'is_verified'               => $stats['n'] >= self::MIN_COMPS_MED,
            ],
            'category' => $category,
        ]);
    }

    // ─── POST /api/report-price ───────────────────────────────
    public function reportPrice(Request $request): JsonResponse
    {
        $v = $request->validate([
            'country'        => ['required','string','max:80'],
            'city'           => ['nullable','string','max:80'],
            'category'       => ['required','string','max:80'],
            'product_name'   => ['required','string','max:120'],
            'price'          => ['required','numeric','min:0'],
            'currency_code'  => ['nullable','string','max:5'],
            'condition'      => ['nullable','string','in:new,used'],
            'market_context' => ['nullable','string','in:souk,modern'],
            'shop_name'      => ['nullable','string','max:120'],
        ]);

        try {
            DB::table('price_reports')->insert([
                'country'        => $v['country'],
                'city'           => $v['city']           ?? null,
                'category'       => strtolower($v['category']),
                'product_name'   => $v['product_name'],
                'price'          => $v['price'],
                'currency_code'  => strtoupper($v['currency_code'] ?? 'MAD'),
                'condition'      => $v['condition']      ?? null,
                'market_context' => $v['market_context'] ?? null,
                'shop_name'      => $v['shop_name']      ?? null,
                'reporter_ip'    => $request->ip(),
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        } catch (\Exception) {}

        return response()->json(['status' => 'OK', 'message' => 'Price report received. Merci!']);
    }

    // ─── Groq caller ─────────────────────────────────────────
    private function callGroq(string $key, string $prompt, string $dataUrl): ?array
    {
        $res = Http::withToken($key)->timeout(35)->withoutVerifying()
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'       => 'meta-llama/llama-4-scout-17b-16e-instruct',
                'temperature' => 0.1,
                'max_tokens'  => 512,
                'messages'    => [[
                    'role'    => 'user',
                    'content' => [
                        ['type' => 'text',      'text'      => $prompt],
                        ['type' => 'image_url', 'image_url' => ['url' => $dataUrl]],
                    ],
                ]],
            ]);

        if (!$res->ok()) return null;
        $raw = data_get($res->json(), 'choices.0.message.content', '');
        preg_match('/\{[\s\S]*\}/', $raw, $m);
        if (empty($m[0])) return null;
        $d = json_decode($m[0], true);
        return is_array($d) ? $d : null;
    }

    // ─── Identification prompt ────────────────────────────────
    private function identPrompt(string $country, ?string $city, string $context): string
    {
        $loc = $city ? "$city, $country" : $country;
        return "You are a product identification expert. Location: {$loc}. Market: {$context}.\n".
               "Analyze the image and respond ONLY with raw JSON:\n".
               '{"name":"","category":"electronics|sneakers|clothing|perfume|watch|handicraft|souvenir|spice|food|carpet|leather|other",'.
               '"brand":"","model":"","variant":"","confidence_identification":0.0,"missing_info":null}'."\n".
               "confidence rules: 0.9+=clear brand+model, 0.7-0.9=recognizable, 0.5-0.7=category only, <0.5=unclear.\n".
               "Set confidence below 0.65 if you cannot identify reliably.";
    }

    // ─── Pricing prompt ───────────────────────────────────────
    private function pricingPrompt(string $q, string $country, ?string $city, string $cond, string $ctx, string $cur): string
    {
        $loc = $city ? "$city, $country" : $country;
        $ctxStr = $ctx === 'modern'
            ? 'MODERN SHOP — fixed prices, no bargaining'
            : 'TRADITIONAL SOUK/BAZAAR — bargaining expected';
        return "You are a local pricing expert for {$loc}.\nItem: {$q}\nCondition: {$cond}\nSetting: {$ctxStr}\nCurrency: MAD base.\n".
               "Generate 5-10 realistic price data points for this item in this setting.\n".
               "Respond ONLY with raw JSON:\n".
               '{"comps":[{"price":number,"source":"shop type"},...],"suggested_price":number}'."\n".
               "For souk: vary prices (tourist/local). For modern: tight cluster. Be realistic for {$loc}.";
    }

    // ─── Strategy router ──────────────────────────────────────
    private function strategy(string $category, string $context): string
    {
        foreach (self::LOCAL_KEYWORDS as $k) {
            if (str_contains($category, $k)) return 'crowd';
        }
        foreach (self::CATALOGABLE_KEYWORDS as $k) {
            if (str_contains($category, $k)) return 'marketplace';
        }
        return $context === 'souk' ? 'crowd' : 'marketplace';
    }

    // ─── Crowd comps from DB ──────────────────────────────────
    private function crowdComps(string $cat, string $country, ?string $city, string $currency): array
    {
        try {
            $q = DB::table('price_reports')
                ->where('country', $country)
                ->where('category', $cat)
                ->where('created_at', '>=', now()->subDays(90))
                ->limit(50)
                ->pluck('price')
                ->toArray();
            $rate = $this->rate('MAD', $currency);
            return array_map(fn($p) => (float)$p * $rate, $q);
        } catch (\Exception) {
            return [];
        }
    }

    // ─── AI comps ─────────────────────────────────────────────
    private function aiComps(string $key, string $dataUrl, string $q, string $country, ?string $city, string $cond, string $ctx, string $currency): array
    {
        $prompt  = $this->pricingPrompt($q, $country, $city, $cond, $ctx, $currency);
        $payload = $this->callGroq($key, $prompt, $dataUrl);
        if (!$payload || !isset($payload['comps'])) return [];

        $rate  = $this->rate('MAD', $currency);
        $comps = [];
        foreach ($payload['comps'] as $c) {
            $p = (float) ($c['price'] ?? 0);
            if ($p > 0) $comps[] = $p * $rate;
        }
        return $comps;
    }

    // ─── IQR stats ────────────────────────────────────────────
    private function stats(array $prices): array
    {
        sort($prices);
        $n = count($prices);
        if ($n === 0) return ['median'=>0,'suggested'=>0,'min'=>0,'max'=>0,'conf'=>0,'n'=>0];

        $q1 = $prices[(int)floor($n*0.25)];
        $q3 = $prices[(int)floor($n*0.75)];
        $iqr = $q3 - $q1;

        $f = array_values(array_filter($prices, fn($p) =>
            $p >= ($q1 - 1.5*$iqr) && $p <= ($q3 + 1.5*$iqr)
        ));
        if (empty($f)) $f = $prices;

        $fn     = count($f);
        $med    = $fn % 2 === 0 ? ($f[$fn/2-1]+$f[$fn/2])/2 : $f[(int)floor($fn/2)];
        $min    = min($f);
        $max    = max($f);
        $sug    = ($min + $med) / 2;
        $disp   = $max > 0 ? ($max - $min) / $max : 1;
        $conf   = round(min($fn/self::MIN_COMPS_HIGH,1)*0.5 + max(0,1-$disp)*0.5, 2);

        return ['median'=>$med,'suggested'=>$sug,'min'=>$min,'max'=>$max,'conf'=>$conf,'n'=>$fn];
    }

    // ─── Helpers ──────────────────────────────────────────────
    private function rate(string $from, string $to): float
    {
        $r = ['MAD'=>1.0,'EUR'=>0.092,'USD'=>0.10,'GBP'=>0.079,'CAD'=>0.14];
        return ($r[$to] ?? 1.0) / ($r[$from] ?? 1.0);
    }

    private function defaultCurrency(string $country): string
    {
        return match($country) {
            'France','Spain','Portugal','Germany','Italy' => 'EUR',
            'UK','United Kingdom'                        => 'GBP',
            'USA','United States'                        => 'USD',
            'Canada'                                     => 'CAD',
            default                                      => 'MAD',
        };
    }

    private function currencyInfo(string $code): array
    {
        return match($code) {
            'EUR' => ['code'=>'EUR','symbol'=>'€', 'prefix'=>true],
            'USD' => ['code'=>'USD','symbol'=>'$', 'prefix'=>true],
            'GBP' => ['code'=>'GBP','symbol'=>'£', 'prefix'=>true],
            'CAD' => ['code'=>'CAD','symbol'=>'C$','prefix'=>true],
            default=> ['code'=>'MAD','symbol'=>'MAD','prefix'=>false],
        };
    }

    private function log(array $data): void
    {
        try {
            DB::table('price_estimates')->insert(array_merge($data, [
                'created_at' => now(), 'updated_at' => now(),
            ]));
        } catch (\Exception) {}
    }
}
