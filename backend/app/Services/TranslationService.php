<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    private ?string $groqApiKey;
    private string $groqApiUrl;
    private ?string $libreTranslateUrl;

    private array $languageNames = [
        'fr' => 'French',
        'en' => 'English',
        'ar' => 'Arabic',
        'es' => 'Spanish',
        'de' => 'German',
        'it' => 'Italian',
        'pt' => 'Portuguese',
        'zh' => 'Simplified Chinese',
        'ja' => 'Japanese',
        'ru' => 'Russian',
    ];

    public function __construct()
    {
        $this->groqApiKey = config('services.groq.api_key');
        $this->groqApiUrl = config('services.groq.api_url', 'https://api.groq.com/openai/v1/chat/completions');
        $this->libreTranslateUrl = config('services.libretranslate.url');
    }

    public function translate(string $text, string $targetLang, string $sourceLang = 'auto'): array
    {
        if ($this->groqApiKey) {
            return $this->translateWithGroq($text, $targetLang, $sourceLang);
        }

        if ($this->libreTranslateUrl) {
            return $this->translateWithLibreTranslate($text, $targetLang, $sourceLang);
        }

        throw new \Exception('No translation service configured');
    }

    private function translateWithGroq(string $text, string $targetLang, string $sourceLang): array
    {
        $targetLabel = $this->languageNames[$targetLang] ?? $targetLang;
        $sourceLabel = $sourceLang !== 'auto' ? ($this->languageNames[$sourceLang] ?? $sourceLang) : 'the detected language';

        $prompt = "You are a professional translator. Translate the following text from {$sourceLabel} to {$targetLabel}.
Rules:
- Reply ONLY with the translated text
- Do not add quotes, explanations, or markdown formatting
- Preserve the original formatting and line breaks
- Keep any proper nouns, brand names, and numbers unchanged

Text to translate:
{$text}";

        $response = Http::withToken($this->groqApiKey)
            ->timeout(30)
            ->post($this->groqApiUrl, [
                'model' => 'llama-3.1-8b-instant',
                'temperature' => 0.1,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

        if (!$response->successful()) {
            throw new \Exception('Groq API request failed: ' . $response->body());
        }

        $data = $response->json();
        $translatedText = $data['choices'][0]['message']['content'] ?? null;

        if (!$translatedText) {
            throw new \Exception('No translation in Groq response');
        }

        return [
            'translated_text' => trim($translatedText),
            'source_language' => $sourceLang,
            'target_language' => $targetLang,
            'provider' => 'groq',
        ];
    }

    private function translateWithLibreTranslate(string $text, string $targetLang, string $sourceLang): array
    {
        $response = Http::timeout(30)
            ->post("{$this->libreTranslateUrl}/translate", [
                'q' => $text,
                'source' => $sourceLang,
                'target' => $targetLang,
                'format' => 'text',
            ]);

        if (!$response->successful()) {
            throw new \Exception('LibreTranslate request failed: ' . $response->body());
        }

        $data = $response->json();

        return [
            'translated_text' => $data['translatedText'] ?? '',
            'source_language' => $data['detectedLanguage']['language'] ?? $sourceLang,
            'target_language' => $targetLang,
            'provider' => 'libretranslate',
        ];
    }

    public function detectLanguage(string $text): array
    {
        $arabicCount = preg_match_all('/[\x{0600}-\x{06FF}]/u', $text);
        $totalChars = mb_strlen(preg_replace('/\s/', '', $text));

        if ($totalChars === 0) {
            return ['language' => 'unknown', 'confidence' => 0];
        }

        $arabicRatio = $arabicCount / $totalChars;

        if ($arabicRatio > 0.5) {
            return ['language' => 'ar', 'confidence' => round($arabicRatio * 100)];
        }

        if (preg_match('/^[a-zA-Z\s.,!?]+$/', $text)) {
            return ['language' => 'en', 'confidence' => 80];
        }

        if (preg_match('/^[a-zA-Z\u00C0-\u024F\s.,!?]+$/', $text)) {
            return ['language' => 'fr', 'confidence' => 75];
        }

        return ['language' => 'unknown', 'confidence' => 50];
    }

    public function getSupportedLanguages(): array
    {
        return [
            ['code' => 'fr', 'label' => 'French', 'native' => 'Français'],
            ['code' => 'en', 'label' => 'English', 'native' => 'English'],
            ['code' => 'ar', 'label' => 'Arabic', 'native' => 'العربية'],
            ['code' => 'es', 'label' => 'Spanish', 'native' => 'Español'],
            ['code' => 'de', 'label' => 'German', 'native' => 'Deutsch'],
            ['code' => 'it', 'label' => 'Italian', 'native' => 'Italiano'],
            ['code' => 'pt', 'label' => 'Portuguese', 'native' => 'Português'],
            ['code' => 'zh', 'label' => 'Chinese', 'native' => '中文'],
            ['code' => 'ja', 'label' => 'Japanese', 'native' => '日本語'],
            ['code' => 'ru', 'label' => 'Russian', 'native' => 'Русский'],
        ];
    }
}
