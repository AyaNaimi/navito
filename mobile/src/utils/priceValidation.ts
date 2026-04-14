import { referencePrices } from '../data/mockData';

export interface MarketReference {
  item: string;
  priceMin: number;
  priceMax: number;
  suggestedPrice: number;
}

const PARSED_REFERENCES: MarketReference[] = referencePrices.map(ref => {
  const parts = ref.price.replace(' MAD', '').split('-');
  const min = parseInt(parts[0]);
  const max = parts.length > 1 ? parseInt(parts[1]) : min;
  return {
    item: ref.item.toLowerCase(),
    priceMin: min,
    priceMax: max,
    suggestedPrice: Math.round((min + max) / 2)
  };
});

export function findMarketReference(itemName: string): MarketReference | null {
  const lowerName = itemName.toLowerCase();
  
  let match = PARSED_REFERENCES.find(ref => lowerName.includes(ref.item) || ref.item.includes(lowerName));
  
  if (!match) {
    const keywords = ['water', 'juice', 'tea', 'tagine', 'couscous', 'taxi', 'babouche', 'oil'];
    const foundKeyword = keywords.find(k => lowerName.includes(k));
    if (foundKeyword) {
      match = PARSED_REFERENCES.find(ref => ref.item.includes(foundKeyword));
    }
  }

  return match || null;
}
