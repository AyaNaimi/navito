<?php

namespace App\Services;

use App\Models\TransportFare;
use Illuminate\Support\Facades\Http;

class PriceEstimationService
{
    private array $referencePrices = [
        ['item' => 'Bottle of Water (1.5L)', 'price' => '5-8 MAD', 'category' => 'Beverages'],
        ['item' => 'Fresh Orange Juice', 'price' => '5-10 MAD', 'category' => 'Beverages'],
        ['item' => 'Mint Tea', 'price' => '8-15 MAD', 'category' => 'Beverages'],
        ['item' => 'Street Food Sandwich', 'price' => '15-25 MAD', 'category' => 'Food'],
        ['item' => 'Tagine (Restaurant)', 'price' => '50-120 MAD', 'category' => 'Food'],
        ['item' => 'Couscous (Restaurant)', 'price' => '60-150 MAD', 'category' => 'Food'],
        ['item' => 'Petit Taxi (per km)', 'price' => '7-8 MAD', 'category' => 'Transport'],
        ['item' => 'Grand Taxi (per km)', 'price' => '10-12 MAD', 'category' => 'Transport'],
        ['item' => 'Bus Ticket (City)', 'price' => '4-7 MAD', 'category' => 'Transport'],
        ['item' => 'Leather Babouches', 'price' => '100-300 MAD', 'category' => 'Souvenirs'],
        ['item' => 'Small Carpet', 'price' => '400-1500 MAD', 'category' => 'Souvenirs'],
        ['item' => 'Argan Oil (100ml)', 'price' => '80-150 MAD', 'category' => 'Souvenirs'],
    ];

    private array $negotiationTips = [
        'Start at 50% of the asking price',
        'Be polite and smile',
        'Walk away if price is too high',
        'Compare prices at multiple shops',
        'Buy in the morning for better deals',
        "Don't show too much interest",
    ];

    public function estimate(?string $item = null, ?string $category = null): array
    {
        $groqApiKey = config('services.groq.api_key');

        if ($item && $groqApiKey) {
            return $this->estimateWithAI($item, $category, $groqApiKey);
        }

        if ($item) {
            return $this->estimateFromDatabase($item, $category);
        }

        return $this->getRandomEstimate();
    }

    private function estimateWithAI(string $item, ?string $category, string $apiKey): array
    {
        $categoryContext = $category ? "Category: {$category}" : '';

        $prompt = "You are a Moroccan market expert. Provide a fair price estimate for: {$item} {$categoryContext}
        
Respond ONLY in JSON format:
{
    \"item\": \"item name\",
    \"category\": \"category\",
    \"min_price\": number,
    \"max_price\": number,
    \"currency\": \"MAD\",
    \"confidence\": number (0-100),
    \"tips\": [\"tip1\", \"tip2\", \"tip3\"]
}";

        $response = Http::withToken($apiKey)
            ->timeout(30)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.1-8b-instant',
                'temperature' => 0.3,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

        if ($response->successful()) {
            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? null;

            if ($content) {
                preg_match('/\{[\s\S]*\}/', $content, $matches);
                if ($matches) {
                    $parsed = json_decode($matches[0], true);
                    if ($parsed) {
                        return [
                            'item' => $parsed['item'] ?? $item,
                            'category' => $parsed['category'] ?? 'General',
                            'price_range' => "{$parsed['min_price']}-{$parsed['max_price']} MAD",
                            'min_price' => $parsed['min_price'],
                            'max_price' => $parsed['max_price'],
                            'currency' => 'MAD',
                            'confidence' => $parsed['confidence'] ?? 70,
                            'tips' => $parsed['tips'] ?? $this->negotiationTips,
                            'provider' => 'groq',
                        ];
                    }
                }
            }
        }

        return $this->estimateFromDatabase($item, $category);
    }

    public function estimateFromDatabase(string $item, ?string $category): array
    {
        $itemLower = strtolower($item);
        $matches = [];

        foreach ($this->referencePrices as $ref) {
            $refLower = strtolower($ref['item']);
            $similarity = 0;

            $itemWords = explode(' ', $itemLower);
            foreach ($itemWords as $word) {
                if (strlen($word) > 2 && str_contains($refLower, $word)) {
                    $similarity += 0.3;
                }
            }

            if (str_contains($refLower, $itemLower) || str_contains($itemLower, $refLower)) {
                $similarity += 0.5;
            }

            if ($category && strtolower($category) === strtolower($ref['category'])) {
                $similarity += 0.3;
            }

            if ($similarity > 0) {
                $matches[] = [
                    'ref' => $ref,
                    'similarity' => $similarity,
                ];
            }
        }

        if (!empty($matches)) {
            usort($matches, fn($a, $b) => $b['similarity'] <=> $a['similarity']);
            $best = $matches[0]['ref'];
            $priceParts = explode('-', str_replace(' MAD', '', $best['price']));

            return [
                'item' => $best['item'],
                'category' => $best['category'],
                'price_range' => $best['price'],
                'min_price' => (int) $priceParts[0],
                'max_price' => (int) $priceParts[1],
                'currency' => 'MAD',
                'confidence' => min(90, 50 + ($matches[0]['similarity'] * 30)),
                'tips' => $this->negotiationTips,
                'provider' => 'database',
                'similar_items' => array_map(fn($m) => $m['ref'], array_slice($matches, 1, 3)),
            ];
        }

        return $this->getRandomEstimate();
    }

    public function getRandomEstimate(): array
    {
        $random = $this->referencePrices[array_rand($this->referencePrices)];
        $priceParts = explode('-', str_replace(' MAD', '', $random['price']));

        return [
            'item' => $random['item'],
            'category' => $random['category'],
            'price_range' => $random['price'],
            'min_price' => (int) $priceParts[0],
            'max_price' => (int) $priceParts[1],
            'currency' => 'MAD',
            'confidence' => 50,
            'tips' => $this->negotiationTips,
            'provider' => 'reference',
        ];
    }

    public function checkPrice(float $askingPrice, float $minPrice, float $maxPrice): array
    {
        $midPrice = ($minPrice + $maxPrice) / 2;

        if ($askingPrice <= $minPrice * 0.9) {
            return [
                'is_fair' => true,
                'verdict' => 'too_low',
                'message' => 'Excellente affaire! Le prix est en dessous du marche.',
                'savings' => round($midPrice - $askingPrice, 2),
            ];
        }

        if ($askingPrice <= $maxPrice * 1.1) {
            return [
                'is_fair' => true,
                'verdict' => 'fair',
                'message' => 'Prix correct. Vous pouvez marchander legerement.',
                'savings' => round($midPrice - $askingPrice, 2),
            ];
        }

        if ($askingPrice <= $maxPrice * 1.5) {
            return [
                'is_fair' => false,
                'verdict' => 'expensive',
                'message' => 'Prix eleve. Negociez ou cherchez ailleurs.',
                'overpay' => round($askingPrice - $midPrice, 2),
            ];
        }

        return [
            'is_fair' => false,
            'verdict' => 'scam',
            'message' => 'Alerte: Prix suspect! Fuyez.',
            'overpay' => round($askingPrice - $midPrice, 2),
        ];
    }

    public function getReferencePrices(): array
    {
        return $this->referencePrices;
    }

    public function getTransportFares(?int $cityId = null, ?string $transportType = null): array
    {
        $query = TransportFare::with(['city.country']);

        if ($cityId) {
            $query->where('city_id', $cityId);
        }

        if ($transportType) {
            $query->where('transport_type', $transportType);
        }

        return $query->get()->toArray();
    }
}
