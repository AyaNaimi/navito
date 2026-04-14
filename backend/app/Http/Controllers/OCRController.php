<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class OCRController extends Controller
{
    public function process(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'string'],
            'mimeType' => ['nullable', 'string'],
        ]);

        $imageData = $validated['image'];
        $mimeType = $validated['mimeType'] ?? 'image/jpeg';

        if (str_starts_with($imageData, 'data:')) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
        }

        try {
            $response = Http::withToken(config('services.groq.key'))
                ->timeout(30)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.2-11b-vision-preview',
                    'temperature' => 0.1,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => [
                                ['type' => 'text', 'text' => 'Extract and return ONLY the text visible in this image. Do not add explanations. If no readable text, return "No text found".'],
                                ['type' => 'image_url', 'image_url' => ['url' => "data:{$mimeType};base64,{$imageData}"]],
                            ],
                        ],
                    ],
                ]);

            if (!$response->ok()) {
                return response()->json(['error' => 'OCR processing failed'], 502);
            }

            $result = data_get($response->json(), 'choices.0.message.content', '');
            
            return response()->json([
                'text' => $result === 'No text found' ? '' : $result,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}