<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class PriceEstimateController extends Controller
{
    public function estimate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:3072'],
            'country' => ['nullable', 'string', 'max:80'],
        ]);

        $country = $validated['country'] ?? null;
        $currency = $this->currencyForCountry($country);
        $rateByCode = [
            'MAD' => 1,
            'EUR' => 0.092,
        ];

        $apiKey = config('services.groq.key');
        $model = config('services.groq.model');

        if (!$apiKey) {
            return response()->json([
                'message' => 'Groq API key missing',
            ], 500);
        }

        $file = $request->file('image');
        $mime = $file->getMimeType() ?: 'image/jpeg';
        $base64 = base64_encode(file_get_contents($file->getRealPath()));
        $dataUrl = sprintf('data:%s;base64,%s', $mime, $base64);

        $prompt = $this->buildPrompt();

        $response = Http::withToken($apiKey)
            ->timeout(30)
            ->withoutVerifying()
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => $model,
                'temperature' => 0.2,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            ['type' => 'text', 'text' => $prompt],
                            ['type' => 'image_url', 'image_url' => ['url' => $dataUrl]],
                        ],
                    ],
                ],
            ]);

        if (!$response->ok()) {
            return response()->json([
                'message' => 'Groq API request failed',
                'status' => $response->status(),
            ], 502);
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        $decoded = is_string($content) ? json_decode($content, true) : null;

        if (!is_array($decoded)) {
            return response()->json([
                'message' => 'Invalid response from Groq',
            ], 502);
        }

        $priceMin = (float) ($decoded['priceMin'] ?? 0);
        $priceMax = (float) ($decoded['priceMax'] ?? 0);

        if ($priceMin > $priceMax) {
            [$priceMin, $priceMax] = [$priceMax, $priceMin];
        }

        $rate = $rateByCode[$currency['code']] ?? 1;
        $priceMin *= $rate;
        $priceMax *= $rate;

        return response()->json([
            'name' => (string) ($decoded['name'] ?? 'Unknown'),
            'category' => (string) ($decoded['category'] ?? 'Unknown'),
            'brand' => (string) ($decoded['brand'] ?? 'Unknown'),
            'confidence' => (float) ($decoded['confidence'] ?? 0.0),
            'priceMin' => round($priceMin, 2),
            'priceMax' => round($priceMax, 2),
            'currency' => [
                'code' => $currency['code'],
                'symbol' => $currency['symbol'],
                'prefix' => $currency['prefix'],
            ],
        ]);
    }

    private function buildPrompt(): string
    {
        return implode("\n", [
            'Analyze the product in the image and estimate a fair price range.',
            'Return ONLY a JSON object with these fields:',
            'name, category, brand, confidence, priceMin, priceMax.',
            'Rules:',
            '- confidence is a number between 0 and 1.',
            '- priceMin and priceMax are numbers in Moroccan dirham (MAD).',
            '- Ensure priceMin <= priceMax.',
        ]);
    }

    private function currencyForCountry(?string $country): array
    {
        $map = [
            'Morocco' => ['code' => 'MAD', 'symbol' => 'MAD', 'prefix' => false],
            'France' => ['code' => 'EUR', 'symbol' => 'EUR', 'prefix' => true],
            'Spain' => ['code' => 'EUR', 'symbol' => 'EUR', 'prefix' => true],
            'Portugal' => ['code' => 'EUR', 'symbol' => 'EUR', 'prefix' => true],
        ];

        if ($country && isset($map[$country])) {
            return $map[$country];
        }

        return $map['Morocco'];
    }
}
