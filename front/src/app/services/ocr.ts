import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export interface OCRProgress {
  status: string;
  progress: number;
}

export async function performOCR(
  imageSource: File | string | Blob,
  options?: {
    language?: string;
    onProgress?: (progress: OCRProgress) => void;
  }
): Promise<OCRResult> {
  const {
    language = 'ara+eng+fra+spa+deu+ita+por',
    onProgress
  } = options || {};

  try {
    const result = await Tesseract.recognize(imageSource, language, {
      logger: (m) => {
        if (onProgress && m.status) {
          onProgress({
            status: m.status,
            progress: m.progress
          });
        }
      }
    });

    const data = result.data;
    
    return {
      text: data.text?.trim() || '',
      confidence: data.confidence || 0,
      blocks: data.blocks?.map(block => ({
        text: block.text,
        confidence: block.confidence,
        bbox: block.bbox
      })) || []
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR processing failed');
  }
}

export async function performOCRWithCloudVision(
  imageSource: File | string,
  apiKey: string
): Promise<OCRResult> {
  const formData = new FormData();
  formData.append('image', imageSource);
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Cloud Vision API failed');
  }

  const data = await response.json();
  const text = data.responses?.[0]?.textAnnotations?.[0]?.description || '';
  
  return {
    text,
    confidence: 100,
    blocks: []
  };
}