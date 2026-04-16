<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PriceEstimationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PriceEstimationController extends Controller
{
    private PriceEstimationService $priceService;

    public function __construct(PriceEstimationService $priceService)
    {
        $this->priceService = $priceService;
    }

    public function estimate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        try {
            $result = $this->priceService->estimate(
                $validated['item'] ?? null,
                $validated['category'] ?? null
            );

            return response()->json(['data' => $result]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Estimation failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function estimateImage(Request $request): JsonResponse
    {
        if (!$request->hasFile('image')) {
            return response()->json([
                'status' => 'ERROR',
                'message' => 'Image required',
            ], 400);
        }

        $image = $request->file('image');
        $country = $request->input('country', 'Morocco');
        $city = $request->input('city');
        $condition = $request->input('condition', 'new');
        $marketContext = $request->input('market_context', 'souk');
        $currency = $request->input('currency', 'MAD');

        try {
            $groqApiKey = config('services.groq.api_key');
            
            if (!$groqApiKey) {
                return response()->json([
                    'status' => 'ERROR',
                    'message' => 'GROQ_API_KEY not configured',
                ], 500);
            }

            $base64Image = base64_encode(file_get_contents($image->getRealPath()));
            
            $marketContextLabel = $marketContext === 'modern' 
                ? 'BOUTIQUE MODERNE / SUPERMARCHE (Prix fixes)' 
                : 'SOUK / MARCHE TRADITIONNEL (Marchandage attendu)';

            $prompt = "Tu es un expert du marche marocain.
Analyse l'article dans cette image.
Le contexte est: {$marketContextLabel}

Fournis une estimation de prix tres precise en MAD (Dirhams Marocains).

Si le contexte est 'modern':
- 'priceMin' et 'priceMax' doivent etre proches (prix fixe).
- 'suggestedPrice' est le prix retail.

Si le contexte est 'souk':
- 'priceMin': Le prix minimum absolu pour les locaux apres marchandage.
- 'priceMax': Le prix maximum juste.
- 'suggestedPrice': L'objectif de marchandage.

Reponds UNIQUEMENT avec ce JSON (sans texte avant ou apres):
{\"name\": \"string\", \"category\": \"string\", \"brand\": \"string\", \"confidence\": 0.9, \"priceMin\": number, \"priceMax\": number, \"suggestedPrice\": number}";

            $response = Http::withToken($groqApiKey)
                ->timeout(60)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'meta-llama/llama-4-scout-17b-16e-instruct',
                    'temperature' => 0.2,
                    'max_tokens' => 256,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => [
                                [
                                    'type' => 'image_url',
                                    'image_url' => ['url' => "data:{$image->getMimeType()};base64,{$base64Image}"],
                                ],
                                [
                                    'type' => 'text',
                                    'text' => $prompt,
                                ],
                            ],
                        ],
                    ],
                ]);

            if (!$response->successful()) {
                Log::error('Groq API error: ' . $response->body());
                return response()->json([
                    'status' => 'ERROR',
                    'message' => 'AI service unavailable',
                ], 500);
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? '';
            
            preg_match('/\{[\s\S]*\}/', $content, $matches);
            
            if (!$matches) {
                return response()->json([
                    'status' => 'NO_MARKET_DATA',
                    'message' => 'Could not analyze image',
                ]);
            }

            $parsed = json_decode($matches[0], true);
            
            if (!$parsed) {
                return response()->json([
                    'status' => 'NO_MARKET_DATA',
                    'message' => 'Invalid response from AI',
                ]);
            }

            $priceMin = $parsed['priceMin'] ?? 0;
            $priceMax = $parsed['priceMax'] ?? 0;
            $priceSuggested = $parsed['suggestedPrice'] ?? $priceMin;
            $priceMedian = (int) (($priceMin + $priceMax) / 2);

            return response()->json([
                'status' => 'OK',
                'identified_product' => [
                    'name' => $parsed['name'] ?? 'Unknown',
                    'brand' => $parsed['brand'] ?? 'Generic',
                ],
                'category' => $parsed['category'] ?? 'General',
                'pricing' => [
                    'price_median' => $priceMedian,
                    'price_suggested' => $priceSuggested,
                    'price_min' => $priceMin,
                    'price_max' => $priceMax,
                ],
                'meta' => [
                    'confidence_identification' => $parsed['confidence'] ?? 0.7,
                    'confidence_price' => $parsed['confidence'] ?? 0.7,
                    'evidence_count' => 0,
                    'is_verified' => false,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Price estimation error: ' . $e->getMessage());
            return response()->json([
                'status' => 'ERROR',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkPrice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'asking_price' => ['required', 'numeric', 'min:0'],
            'min_price' => ['required', 'numeric', 'min:0'],
            'max_price' => ['required', 'numeric', 'min:0'],
        ]);

        $result = $this->priceService->checkPrice(
            (float) $validated['asking_price'],
            (float) $validated['min_price'],
            (float) $validated['max_price']
        );

        return response()->json(['data' => $result]);
    }

    public function referencePrices(): JsonResponse
    {
        return response()->json([
            'data' => $this->priceService->getReferencePrices(),
        ]);
    }

    public function transportFares(Request $request): JsonResponse
    {
        $result = $this->priceService->getTransportFares(
            $request->input('city_id'),
            $request->input('transport_type')
        );

        return response()->json(['data' => $result]);
    }
}
