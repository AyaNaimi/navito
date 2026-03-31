<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class TranslateController extends Controller
{
    public function translate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string'],
            'target' => ['required', 'string'],
            'source' => ['nullable', 'string'],
        ]);

        $apiKey = config('services.groq.key');
        if (!$apiKey) {
            return response()->json(['error' => 'Groq API key missing'], 500);
        }

        $prompt = sprintf(
            "Translate the following text to '%s'. Reply ONLY with the translated text, do not add any quotes, markdown formatting, or explanations.\n\nText: %s",
            $validated['target'],
            $validated['q']
        );

        $response = Http::withToken($apiKey)
            ->timeout(20)
            ->withoutVerifying()
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.1-8b-instant',
                'temperature' => 0.1,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

        if (!$response->ok()) {
            return response()->json(['error' => 'Translation failed'], 502);
        }

        $translatedText = data_get($response->json(), 'choices.0.message.content');
        
        return response()->json([
            'translatedText' => trim($translatedText)
        ]);
    }
}
