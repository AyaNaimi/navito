export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'fr', label: 'French', nativeLabel: 'Francais' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'Arabic' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Espanol' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Portugues' },
  { code: 'zh', label: 'Chinese', nativeLabel: 'Chinese' },
  { code: 'ja', label: 'Japanese', nativeLabel: 'Japanese' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Russian' },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function translateViaBackend(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto',
): Promise<string> {
  const response = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      text,
      target_language: targetLang,
      source_language: sourceLang,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { message?: string; error?: string };
    throw new Error(errorData.message || errorData.error || 'Translation failed');
  }

  const data = await response.json() as { translated_text?: string; data?: { translated_text?: string } };
  const translatedText = data.translated_text ?? data.data?.translated_text;

  if (!translatedText) {
    throw new Error('Empty translation response');
  }

  return translatedText.trim();
}

export async function translateText(
  text: string,
  targetLang: string,
  options?: {
    sourceLang?: string;
    preferService?: 'groq' | 'libretranslate' | 'auto';
  },
): Promise<string> {
  const { sourceLang = 'auto', preferService = 'auto' } = options || {};
  const trimmed = text.trim();

  if (!trimmed) {
    return '';
  }

  try {
    return await translateViaBackend(trimmed, targetLang, sourceLang);
  } catch (error) {
    if (preferService !== 'auto') {
      throw error;
    }
  }

  throw new Error('Translation service unavailable');
}

export function hasTranslationProvider() {
  return Boolean(API_BASE);
}
