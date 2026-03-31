export type Currency = {
  code: string;
  symbol: string;
  rateFromMAD?: number;
  prefix: boolean;
};

export type EstimateResult = {
  name: string;
  category: string;
  brand: string;
  confidence: number;
  priceMin: number;
  priceMax: number;
  currency: Currency;
};

// IMPORTANT: Must be VITE_ prefixed to be exposed by Vite to the browser
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Encodes a File to base64 data URL for sending to Groq vision models.
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Estimates the price of a product visible in `file` using
 * the Groq vision API (llama-3.2-11b-vision-preview).
 * Prices are returned in MAD by default; the caller is responsible
 * for applying currency conversion.
 */
export async function estimatePriceFromImage(
  file: File,
  country: string | null,
  language: string = 'en'
): Promise<EstimateResult> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key is not configured. Set VITE_GROQ_API_KEY in .env');
  }

  const base64 = await fileToBase64(file);

  const prompt = `You are a market price expert. Analyze the product in the photo.
Consider the country context: ${country ?? 'Morocco'}. Give prices in MAD base (I will convert locally).
CRITICAL: Translate the 'name', 'category', and 'brand' values into the language with language code '${language}'.
Respond ONLY with a JSON object (no markdown, no explanation) like:
{
  "name": "Short product name (translated)",
  "category": "Category (translated)",
  "brand": "Brand or 'Generic' if unknown (translated)",
  "confidence": 0.85,
  "priceMin": 10,
  "priceMax": 20,
  "currency": { "code": "MAD", "symbol": "MAD", "prefix": false }
}
confidence between 0-1.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.2,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: base64 },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Groq API error ${response.status}`);
  }

  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? '';

  // Extract JSON even if surrounded by markdown fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Groq response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    name?: string;
    category?: string;
    brand?: string;
    confidence?: number;
    priceMin?: number;
    priceMax?: number;
    currency?: { code: string; symbol: string; prefix: boolean };
  };

  return {
    name: parsed.name ?? 'Unknown product',
    category: parsed.category ?? 'General',
    brand: parsed.brand ?? 'Generic',
    confidence: Math.min(Math.max(parsed.confidence ?? 0.75, 0), 1),
    priceMin: parsed.priceMin ?? 0,
    priceMax: parsed.priceMax ?? 0,
    currency: parsed.currency ?? { code: 'MAD', symbol: 'MAD', prefix: false },
  };
}
