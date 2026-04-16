export type Currency = {
  code: string;
  symbol: string;
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

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function estimatePriceFromImage(
  file: File,
  marketContext: MarketContext = 'souk',
  language: string = 'fr'
): Promise<EstimateResult> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY non configuree. Ajoute VITE_GROQ_API_KEY dans .env');
  }

  const base64 = await fileToBase64(file);

  const prompt = `Tu es un expert du marche marocain.
Analyse l'article dans cette image.
Le contexte est: ${marketContext === 'modern' ? 'BOUTIQUE MODERNE / SUPERMARCHE (Prix fixes)' : 'SOUK / MARCHE TRADITIONNEL (Marchandage attendu)'}.

Fournis une estimation de prix tres precise en MAD (Dirhams Marocains).

Si le contexte est 'modern':
- 'priceMin' et 'priceMax' doivent etre proches (prix fixe).
- 'suggestedPrice' est le prix retail.

Si le contexte est 'souk':
- 'priceMin': Le prix minimum absolu pour les locaux apres marchandage.
- 'priceMax': Le prix maximum juste.
- 'suggestedPrice': L'objectif de marchandage.

Traduis 'name', 'category', et 'brand' en francais.

Reponds UNIQUEMENT avec ce JSON:
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
    throw new Error(err.error?.message ?? `Erreur API Groq ${response.status}`);
  }

  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? '';

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Pas de JSON dans la reponse');
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

  return {
    name: parsed.name ?? 'Produit inconnu',
    category: parsed.category ?? 'General',
    brand: parsed.brand ?? 'Generic',
    confidence: Math.min(Math.max(parsed.confidence ?? 0.75, 0), 1),
    priceMin: parsed.priceMin ?? 0,
    priceMax: parsed.priceMax ?? 0,
    suggestedPrice: parsed.suggestedPrice ?? parsed.priceMin ?? 0,
    isVerified: false,
    currency: parsed.currency ?? { code: 'MAD', symbol: 'MAD', prefix: false },
  };
}

export async function estimateViaBackend(
  file: File,
  options: {
    country?: string;
    city?: string;
    condition?: 'new' | 'used';
    marketContext?: MarketContext;
    currency?: string;
  } = {}
): Promise<{
  status: 'OK' | 'INSUFFICIENT_DATA' | 'NO_MARKET_DATA' | 'ERROR';
  identified_product?: { name: string; brand: string };
  category?: string;
  pricing?: {
    price_median: number;
    price_suggested: number;
    price_min: number;
    price_max: number;
  };
  meta?: {
    confidence_identification: number;
    confidence_price: number;
    evidence_count: number;
    is_verified: boolean;
  };
  message?: string;
}> {
  const form = new FormData();
  form.append('image', file);
  if (options.country) form.append('country', options.country);
  if (options.city) form.append('city', options.city);
  if (options.condition) form.append('condition', options.condition);
  if (options.marketContext) form.append('market_context', options.marketContext);
  if (options.currency) form.append('currency', options.currency);

  const res = await fetch(`${API_BASE}/price/estimate-image`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(error.message || 'Price estimation request failed');
  }

  return await res.json();
}
