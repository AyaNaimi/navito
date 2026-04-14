import type { MarketContext } from './priceEstimator';

const BACKEND_URL = import.meta.env.VITE_PRICE_ESTIMATOR_ENDPOINT?.replace('/price-estimate', '') ?? 'http://localhost:8000/api';

export type EstimateStatus = 'OK' | 'INSUFFICIENT_DATA' | 'NO_MARKET_DATA' | 'ERROR';

export type BackendEstimateResult = {
  status: EstimateStatus;

  // OK fields
  identified_product?: {
    name: string;
    brand: string;
    model: string;
    variant: string;
  };
  market?: {
    country: string;
    city: string | null;
    condition: string;
    market_context: string;
  };
  pricing?: {
    price_median: number;
    price_suggested: number;
    price_min: number;
    price_max: number;
    currency: { code: string; symbol: string; prefix: boolean };
  };
  meta?: {
    confidence_identification: number;
    confidence_price: number;
    evidence_count: number;
    strategy: string;
    is_verified: boolean;
  };
  category?: string;

  // Error / insufficient fields
  message?: string;
  missing_info?: string;
  hint?: string;
  confidence_identification?: number;
};

export type ReportPriceInput = {
  country: string;
  city?: string;
  category: string;
  product_name: string;
  price: number;
  currency_code?: string;
  condition?: 'new' | 'used';
  market_context?: MarketContext;
  shop_name?: string;
};

/**
 * Main estimate call — sends image + context to the Laravel backend.
 */
export async function estimateViaBackend(
  file: File,
  options: {
    country?: string;
    city?: string;
    condition?: 'new' | 'used';
    marketContext?: MarketContext;
    currency?: string;
  } = {}
): Promise<BackendEstimateResult> {
  const form = new FormData();
  form.append('image', file);
  if (options.country)       form.append('country',        options.country);
  if (options.city)          form.append('city',           options.city);
  if (options.condition)     form.append('condition',      options.condition);
  if (options.marketContext) form.append('market_context', options.marketContext);
  if (options.currency)      form.append('currency',       options.currency);

  const res = await fetch(`${BACKEND_URL}/estimate`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}`);
  }

  return res.json() as Promise<BackendEstimateResult>;
}

/**
 * Crowd-source price report — lets users submit real prices they saw.
 */
export async function reportPrice(data: ReportPriceInput): Promise<void> {
  await fetch(`${BACKEND_URL}/report-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
