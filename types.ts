export interface Tariff {
  id: string;
  name: string;
  speed: number;
  channels?: number;
  mobile?: string;
  price: number;
  oldPrice?: number;
  features: string[];
  equipment: string;
  description: string;
}

export type Bundle = 'internet' | 'internet_tv' | 'internet_mobile' | 'all';
export type PeopleCount = '1-2' | '3-4' | '5+';
export type BudgetStrategy = 'min' | 'balanced' | 'max';
export type FeatureTag = 'work' | 'cinema' | 'gaming' | 'download' | 'cctv' | 'browsing';

export interface Answers {
  bundle: Bundle | null;
  peopleCount: PeopleCount;
  featureTags: FeatureTag[];
  budgetStrategy: BudgetStrategy;
}

export interface BadgeInfo {
  type: 'gift' | 'upsell' | 'cctv' | 'gaming' | 'rational' | 'winner' | 'tech' | 'warn';
  title: string;
  text: string;
}

export interface ScoredTariff extends Tariff {
  score: number;
  reasons: string[];
  hasSim: boolean;
  hasTv: boolean;
  cpm: number;
  pEff: number; // Effective price for calculation
  badge?: BadgeInfo;
}

export interface CalculationResult {
  winner: ScoredTariff | null;
  alternatives: ScoredTariff[];
  others: ScoredTariff[];
  summary: {
    bundle: string;
    people: string;
    tags: string;
    strat: string;
  } | null;
  fallbackAlert: string | null;
}