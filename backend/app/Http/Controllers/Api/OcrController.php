<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrController extends Controller
{
    private ?string $ocrApiUrl;
    private ?string $ocrApiKey;

    public function __construct()
    {
        $this->ocrApiUrl = config('services.ocr.api_url');
        $this->ocrApiKey = config('services.ocr.api_key');
    }

    public function extractText(Request $request): JsonResponse
    {
        if (!$request->hasFile('image') && !$request->filled('image_url')) {
            return response()->json([
                'error' => 'No image provided',
                'message' => 'Provide either an image file or image_url',
            ], 400);
        }

        try {
            if ($this->ocrApiUrl && $this->ocrApiKey) {
                return $this->extractWithApi($request);
            }

            return $this->extractBasic($request);
        } catch (\Exception $e) {
            Log::error('OCR failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'OCR processing failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function extractWithApi(Request $request): JsonResponse
    {
        $formData = new \Illuminate\Http\Request();

        if ($request->hasFile('image')) {
            $formData->merge($request->all());
            $formData->merge(['file' => $request->file('image')]);
        }

        if ($request->filled('image_url')) {
            $imageUrl = $request->input('image_url');
            $imageContent = file_get_contents($imageUrl);
            $tempFile = tempnam(sys_get_temp_dir(), 'ocr_');
            file_put_contents($tempFile, $imageContent);
            $formData->merge(['file' => new \Illuminate\Http\File($tempFile)]);
        }

        $response = Http::withToken($this->ocrApiKey)
            ->timeout(60)
            ->attach('image', file_get_contents($formData->file('file')), 'image.jpg')
            ->post("{$this->ocrApiUrl}/ocr");

        return response()->json([
            'text' => $response['text'] ?? $response['translatedText'] ?? '',
            'confidence' => $response['confidence'] ?? 85,
            'language' => $response['language'] ?? 'auto',
            'provider' => 'api',
        ]);
    }

    private function extractBasic(Request $request): JsonResponse
    {
        return response()->json([
            'text' => '',
            'confidence' => 0,
            'language' => 'unknown',
            'provider' => 'none',
            'message' => 'No OCR service configured. Use frontend Tesseract.js for client-side OCR.',
        ], 503);
    }

    public function detectLanguage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['required', 'string'],
        ]);

        $text = $validated['text'];

        $arabicCount = preg_match_all('/[\x{0600}-\x{06FF}]/u', $text);
        $totalChars = mb_strlen(preg_replace('/\s/', '', $text));

        if ($totalChars === 0) {
            return response()->json([
                'language' => 'unknown',
                'confidence' => 0,
            ]);
        }

        $arabicRatio = $arabicCount / $totalChars;

        if ($arabicRatio > 0.5) {
            return response()->json([
                'language' => 'ar',
                'confidence' => round($arabicRatio * 100),
            ]);
        }

        if (preg_match('/^[a-zA-Z\s.,!?]+$/', $text)) {
            return response()->json([
                'language' => 'en',
                'confidence' => 80,
            ]);
        }

        if (preg_match('/^[a-zA-Z\u00C0-\u024F\s.,!?]+$/', $text)) {
            return response()->json([
                'language' => 'fr',
                'confidence' => 75,
            ]);
        }

        return response()->json([
            'language' => 'unknown',
            'confidence' => 50,
        ]);
    }
}
