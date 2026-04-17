const env = import.meta.env;

export const aiConfig = {
  ocr: {
    apiUrl: env.VITE_AI_OCR_API_URL || '',
    apiKey: env.VITE_AI_OCR_API_KEY || '',
  },
  translation: {
    apiUrl: env.VITE_AI_TRANSLATION_API_URL || '',
    apiKey: env.VITE_AI_TRANSLATION_API_KEY || '',
    groqApiKey: env.VITE_GROQ_API_KEY || '',
    libreTranslateUrl: env.VITE_LIBRETRANSLATE_URL || '',
  },
  image: {
    apiUrl: env.VITE_AI_IMAGE_API_URL || '',
    apiKey: env.VITE_AI_IMAGE_API_KEY || '',
  },
} as const;

export function isAiServiceConfigured(service: keyof typeof aiConfig) {
  const target = aiConfig[service];
  return Boolean(target.apiUrl && target.apiKey);
}
