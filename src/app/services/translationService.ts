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

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const LIBRETRANSLATE_URL = import.meta.env.VITE_LIBRETRANSLATE_URL as string | undefined;

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'French',
  en: 'English',
  ar: 'Arabic',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
  ru: 'Russian',
};

async function translateWithGroq(text: string, targetLang: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key not configured');
  }

  const targetLabel = LANGUAGE_NAMES[targetLang] ?? targetLang;
  const prompt = `You are a professional translator. Translate the following text to ${targetLabel}.
Rules:
- Reply ONLY with the translated text
- Do not add quotes, explanations, or markdown formatting
- Preserve the original formatting and line breaks
- Keep any proper nouns, brand names, and numbers unchanged

Text to translate:
${text.trim()}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message ?? 'Groq translation failed');
  }

  const data = await response.json();
  const translatedText = data.choices?.[0]?.message?.content;

  if (!translatedText) {
    throw new Error('No translation from Groq');
  }

  return translatedText.trim();
}

async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto',
): Promise<string> {
  if (!LIBRETRANSLATE_URL) {
    throw new Error('LibreTranslate not configured');
  }

  const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  if (!response.ok) {
    throw new Error('LibreTranslate failed');
  }

  const data = await response.json();
  return data.translatedText;
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

  if (preferService === 'groq') {
    return translateWithGroq(trimmed, targetLang);
  }

  if (preferService === 'libretranslate') {
    return translateWithLibreTranslate(trimmed, targetLang, sourceLang);
  }

  const errors: string[] = [];

  try {
    return await translateWithLibreTranslate(trimmed, targetLang, sourceLang);
  } catch (error) {
    errors.push(String(error));
  }

  try {
    return await translateWithGroq(trimmed, targetLang);
  } catch (error) {
    errors.push(String(error));
  }

  throw new Error(`All translation services failed: ${errors.join(', ')}`);
}

export function hasTranslationProvider() {
  return Boolean(LIBRETRANSLATE_URL || GROQ_API_KEY);
}
