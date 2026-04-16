<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    private TranslationService $translationService;

    public function __construct(TranslationService $translationService)
    {
        $this->translationService = $translationService;
    }

    public function translate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:10000'],
            'target_language' => ['required', 'string', 'size:2'],
            'source_language' => ['nullable', 'string', 'size:2'],
        ]);

        try {
            $result = $this->translationService->translate(
                $validated['text'],
                $validated['target_language'],
                $validated['source_language'] ?? 'auto'
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Translation failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function detectLanguage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:10000'],
        ]);

        $result = $this->translationService->detectLanguage($validated['text']);

        return response()->json($result);
    }

    public function supportedLanguages(): JsonResponse
    {
        return response()->json([
            'languages' => $this->translationService->getSupportedLanguages(),
        ]);
    }
}
