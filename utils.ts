import { Tariff, Bundle } from './types';
import { CONFIG } from './constants';

export const hasKeyword = (text: string, keywords: string[]): boolean => {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
};

export const calcEffectivePrice = (tariff: Tariff, bundle: Bundle): number => {
  let pEff = tariff.price;
  
  if (bundle === 'internet') {
    const isRealMobileBundle = !!tariff.mobile && hasKeyword(tariff.mobile, ["минут", "безлимит", "sms"]);
    const hasTv = !!tariff.channels || hasKeyword(tariff.description + tariff.features.join(' '), CONFIG.KEYWORDS.TV_CONTENT);
    
    if (isRealMobileBundle) pEff -= CONFIG.DEDUCTIONS.SIM;
    if (hasTv) pEff -= CONFIG.DEDUCTIONS.TV;
  }
  return Math.max(pEff, 1);
};

export const filterByBundle = (allTariffs: Tariff[], bundle: Bundle): Tariff[] => {
  const withInternet = allTariffs.filter(t => !t.price || t.price > 0);

  switch (bundle) {
    case 'internet':
      return withInternet;
    case 'internet_tv':
      return withInternet.filter(t => 
        (t.channels && t.channels > 0) || 
        hasKeyword(t.features.join(' ') + t.description, CONFIG.KEYWORDS.TV_CONTENT)
      );
    case 'all':
      return withInternet.filter(t => 
        ((t.channels && t.channels > 0) || hasKeyword(t.features.join(' '), CONFIG.KEYWORDS.TV_CONTENT)) &&
        (t.mobile && hasKeyword(t.mobile, CONFIG.KEYWORDS.MOBILE))
      );
    case 'internet_mobile':
      return withInternet.filter(t => 
        t.mobile && hasKeyword(t.mobile, CONFIG.KEYWORDS.MOBILE)
      );
    default:
      return withInternet;
  }
};