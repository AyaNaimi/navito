export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺' },
];

// IMPORTANT: Must be VITE_ prefixed to be exposed by Vite to the browser
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key is not configured. Make sure VITE_GROQ_API_KEY is set in your .env file.');
  }

  const targetLabel = LANGUAGE_NAMES[targetLang] ?? targetLang;

  const prompt = `You are a professional translator. Translate the following text to ${targetLabel}.
Rules:
- Reply ONLY with the translated text
- Do not add quotes, explanations, or markdown formatting
- Preserve the original formatting and line breaks
- Keep any proper nouns, brand names, and numbers unchanged

Text to translate:
${trimmed}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(errorData.error?.message ?? 'Translation failed');
  }

  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  const translatedText = data.choices?.[0]?.message?.content;

  if (!translatedText) {
    throw new Error('No translation received from Groq API');
  }

  return translatedText.trim();
}
