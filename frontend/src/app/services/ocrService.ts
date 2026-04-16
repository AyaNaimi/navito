import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
}

export interface OcrProgress {
  status: string;
  progress: number;
}

const OCR_API_URL = import.meta.env.VITE_AI_OCR_API_URL as string | undefined;
const OCR_API_KEY = import.meta.env.VITE_AI_OCR_API_KEY as string | undefined;
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function isOcrConfigured() {
  return Boolean(API_BASE || (OCR_API_URL && OCR_API_KEY));
}

export async function extractTextFromImage(
  imageSource: string | File | Blob,
  onProgress?: (progress: OcrProgress) => void
): Promise<OcrResult> {
  try {
    return await extractTextViaBackend(imageSource);
  } catch {
    if (OCR_API_URL && OCR_API_KEY) {
      return extractTextWithApi(imageSource);
    }
  }

  return extractTextWithTesseract(imageSource, onProgress);
}

async function extractTextViaBackend(imageSource: string | File | Blob): Promise<OcrResult> {
  const formData = new FormData();

  if (typeof imageSource === 'string') {
    formData.append('image_url', imageSource);
  } else {
    formData.append('image', imageSource);
  }

  const response = await fetch(`${API_BASE}/ocr/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Backend OCR request failed');
  }

  const data = await response.json();

  return {
    text: data.text || '',
    confidence: data.confidence || 90,
    language: data.language || 'auto',
  };
}

async function extractTextWithApi(imageSource: string | File | Blob): Promise<OcrResult> {
  const formData = new FormData();
  
  if (typeof imageSource === 'string') {
    const response = await fetch(imageSource);
    const blob = await response.blob();
    formData.append('image', blob, 'image.jpg');
  } else {
    formData.append('image', imageSource);
  }

  const response = await fetch(`${OCR_API_URL}/ocr`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OCR_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('OCR API request failed');
  }

  const data = await response.json();
  
  return {
    text: data.text || data.translatedText || '',
    confidence: data.confidence || 90,
    language: data.language || 'auto',
  };
}

async function extractTextWithTesseract(
  imageSource: string | File | Blob,
  onProgress?: (progress: OcrProgress) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(
    imageSource,
    'eng+ara+fra+spa+deu',
    {
      logger: (m) => {
        if (onProgress && m.status) {
          onProgress({
            status: m.status,
            progress: m.progress * 100,
          });
        }
      },
    }
  );

  return {
    text: result.data.text,
    confidence: result.data.confidence,
    language: 'auto',
  };
}

export async function detectLanguage(text: string): Promise<string> {
  const arCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const total = text.replace(/\s/g, '').length;
  
  if (total === 0) return 'unknown';
  
  const arabicRatio = arCount / total;
  
  if (arabicRatio > 0.5) return 'ar';
  if (/^[a-zA-Z\s.,!?]+$/.test(text)) return 'en';
  if (/^[a-zA-Z\u00C0-\u024F\s.,!?]+$/.test(text)) return 'fr';
  
  return 'unknown';
}
