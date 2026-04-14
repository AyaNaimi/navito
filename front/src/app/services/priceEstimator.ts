import { findMarketReference } from '../utils/priceValidation';

export type Currency = {
  code: string;
  symbol: string;
  rateFromMAD?: number;
  prefix: boolean;
};

export type MarketContext = 'modern' | 'souk';

export type EstimateResult = {
  name: string;
  category: string;
  brand: string;
  confidence: number;
  priceMin: number;
  priceMax: number;
  suggestedPrice: number;
  currency: Currency;
  isVerified?: boolean;
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
  language: string = 'en',
  marketContext: MarketContext = 'souk'
): Promise<EstimateResult> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key is not configured. Set VITE_GROQ_API_KEY in .env');
  }

  const base64 = await fileToBase64(file);

  const prompt = `You are an expert on the Moroccan market and pricing. 
Analyze the item in this image. 
The user is currently in a ${marketContext === 'modern' ? 'MODERN SHOP / SUPERMARKET (Fixed prices)' : 'TRADITIONAL SOUK / MARKET (Bargaining expected)'}.

Provide a HIGHLY ACCURATE price estimation in MAD (Moroccan Dirhams).

If marketContext is 'modern':
- 'priceMin' and 'priceMax' should be very close (fixed price).
- 'suggestedPrice' is the retail sticker price.

If marketContext is 'souk':
- 'priceMin': The absolute minimum price for locals after heavy bargaining.
- 'priceMax': The maximum fair price.
- 'suggestedPrice': The target bargaining goal.

CRITICAL: Translate 'name', 'category', and 'brand' to the language with code '${language}'.
Focus on specific item quality and the ${marketContext} setting.

Respond ONLY with this JSON:
{
  "name": "string",
  "category": "string",
  "brand": "string",
  "confidence": 0.9,
  "priceMin": number,
  "priceMax": number,
  "suggestedPrice": number,
  "currency": { "code": "MAD", "symbol": "MAD", "prefix": false }
}`;

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
    suggestedPrice?: number;
    currency?: { code: string; symbol: string; prefix: boolean };
  };

  const name = parsed.name ?? 'Unknown product';
  const reference = findMarketReference(name);
  
  return {
    name,
    category: reference?.item ? 'Verified Category' : (parsed.category ?? 'General'),
    brand: parsed.brand ?? 'Generic',
    confidence: reference ? 1.0 : Math.min(Math.max(parsed.confidence ?? 0.75, 0), 1),
    priceMin: reference?.priceMin ?? (parsed.priceMin ?? 0),
    priceMax: reference?.priceMax ?? (parsed.priceMax ?? 0),
    suggestedPrice: reference?.suggestedPrice ?? (parsed.suggestedPrice ?? parsed.priceMin ?? 0),
    isVerified: !!reference,
    currency: parsed.currency ?? { code: 'MAD', symbol: 'MAD', prefix: false },
  };
}
