import { useMemo } from 'react';
import { Answers, CalculationResult, ScoredTariff } from '../types';
import { TARIFFS_DATA, CONFIG, UI_COPY } from '../constants';
import { filterByBundle, calcEffectivePrice, hasKeyword } from '../utils';

export const useTariffCalculator = (answers: Answers, showResults: boolean): CalculationResult => {
  return useMemo(() => {
    if (!showResults || !answers.bundle) {
      return { winner: null, alternatives: [], others: [], summary: null, fallbackAlert: null };
    }

    // 1. FILTER
    let candidates = filterByBundle(TARIFFS_DATA, answers.bundle);
    let fallbackAlert = null;

    if (candidates.length === 0) {
      if (answers.bundle === 'internet_tv' || answers.bundle === 'all') {
        fallbackAlert = "По выбранному набору услуг (Интернет + ТВ) тарифов сейчас нет. Показаны лучшие варианты только с домашним интернетом.";
      } else if (answers.bundle === 'internet_mobile') {
        fallbackAlert = "По вашему адресу пока нет тарифов с мобильной связью. Показаны лучшие варианты только с домашним интернетом.";
      } else {
        fallbackAlert = "Не удалось подобрать тарифы с учётом всех условий. Показаны базовые предложения.";
      }
      candidates = TARIFFS_DATA; // Fallback
    }

    // 2. TARGET SPEED
    let vTarget = CONFIG.TIERS.MID;
    if (answers.peopleCount === '1-2') vTarget = CONFIG.TIERS.LOW;
    if (answers.peopleCount === '5+') vTarget = CONFIG.TIERS.HIGH;

    if (answers.featureTags.includes('work') && answers.peopleCount === '1-2') vTarget = 200;
    if (answers.featureTags.includes('cinema')) vTarget = Math.max(vTarget, 100);
    if (answers.featureTags.includes('download')) vTarget = Math.max(...TARIFFS_DATA.map(t => t.speed));
    if (answers.featureTags.includes('browsing') && answers.featureTags.length === 1) vTarget = CONFIG.TIERS.LOW;

    // 3. SCORING
    const candidatesWithPeff = candidates.map(t => ({...t, pEff: calcEffectivePrice(t, answers.bundle!)}));
    const minPriceMarket = Math.min(...candidatesWithPeff.map(t => t.pEff));
    const avgCpm = candidatesWithPeff.reduce((acc, t) => acc + (t.pEff / t.speed), 0) / candidatesWithPeff.length;

    const scored: ScoredTariff[] = candidatesWithPeff.map(t => {
      let bonuses = 0;
      let reasons: string[] = [];

      let sSpeed = 0;
      if (t.speed < vTarget) {
        const ratio = t.speed / vTarget;
        sSpeed = Math.pow(ratio, 2) * 0.5 * 100; 
      } else {
        const ratio = t.speed / vTarget;
        sSpeed = 100 + (Math.log10(ratio) * 30);
      }

      const sPrice = (minPriceMarket / t.pEff) * 100;

      if (answers.featureTags.includes('work') && t.speed < 50) bonuses -= 10;
      if (answers.featureTags.includes('cinema')) {
        if (t.channels || hasKeyword(t.features.join(' '), CONFIG.KEYWORDS.TV_CONTENT)) bonuses += 15;
        if (t.speed < 100) bonuses -= 10;
      }
      if (answers.featureTags.includes('gaming')) {
        const isGaming = hasKeyword(t.name, CONFIG.KEYWORDS.GAMING) || t.speed >= 1000;
        if (isGaming) bonuses += 25;
        else if (t.speed >= 500) bonuses += 10;
      }
      if (answers.featureTags.includes('cctv')) {
        const hasStaticIp = hasKeyword(t.description + t.features.join(' '), CONFIG.KEYWORDS.STATIC_IP);
        if (hasStaticIp) bonuses += 20;
      }

      const cpm = t.pEff / t.speed;
      if (cpm <= CONFIG.UPSELL.CPM_BONUS_THRESHOLD * avgCpm) bonuses += CONFIG.UPSELL.CPM_BONUS_SCORE;

      let { K_price, K_speed } = CONFIG.STRATEGY_WEIGHTS[answers.budgetStrategy];
      if (answers.featureTags.includes('browsing') && answers.featureTags.length === 1) {
        K_price = Math.max(K_price, 0.8);
        K_speed = Math.min(K_speed, 0.2);
      }

      const score = (sSpeed * K_speed) + (sPrice * K_price) + bonuses;

      if (t.speed >= vTarget) reasons.push(`Скорости хватает для ${answers.peopleCount} чел.`);
      if (answers.featureTags.includes('gaming') && (hasKeyword(t.name, CONFIG.KEYWORDS.GAMING) || t.speed >= 500)) reasons.push('Подходит для гейминга');
      if (answers.featureTags.includes('cctv') && hasKeyword(t.description, CONFIG.KEYWORDS.STATIC_IP)) reasons.push('Поддержка камер (IP)');
      if (cpm < avgCpm * 0.7) reasons.push('Выгодная цена за 1 Мбит');
      
      const hasTv = !!t.channels || hasKeyword(t.features.join(' '), CONFIG.KEYWORDS.TV_CONTENT);
      if (['internet_tv', 'all'].includes(answers.bundle!) && hasTv) reasons.push('Включает ТВ-каналы');

      return { ...t, score, reasons, hasSim: !!t.mobile, hasTv, cpm };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    const win = sorted[0];

    if (!win) {
       // Should theoretically not happen given the fallback logic above, but for safety
       return { winner: null, alternatives: [], others: [], summary: null, fallbackAlert: "Не найдено подходящих тарифов." };
    }

    // 4. BADGE LOGIC
    const processedWinner: ScoredTariff = (() => {
      if (fallbackAlert) {
        return { ...win, badge: { type: 'warn', ...UI_COPY.badges.fallback } };
      }
      
      const minInternetPrice = Math.min(...TARIFFS_DATA.map(t => t.price)); 
      if (answers.bundle === 'internet' && (win.hasSim || win.hasTv) && win.price <= minInternetPrice + 100) {
        return { ...win, badge: { type: 'gift', ...UI_COPY.badges.gift } };
      }
      const cheapAnalog = sorted.find(t => t.price < win.price);
      if (cheapAnalog && win.price <= cheapAnalog.price * CONFIG.UPSELL.PRICE_TOLERANCE && win.speed >= cheapAnalog.speed * CONFIG.UPSELL.SPEED_MULTIPLIER) {
         return { ...win, badge: { type: 'upsell', ...UI_COPY.badges.upsell } };
      }
      if (answers.featureTags.includes('cctv') && hasKeyword(win.description, CONFIG.KEYWORDS.STATIC_IP)) {
        return { ...win, badge: { type: 'tech', ...UI_COPY.badges.cctv } };
      }
      if (answers.featureTags.includes('gaming') && (hasKeyword(win.name, CONFIG.KEYWORDS.GAMING) || win.speed >= 1000)) {
        return { ...win, badge: { type: 'gaming', ...UI_COPY.badges.gaming } };
      }
      return { ...win, badge: { type: 'winner', ...UI_COPY.badges.default } };
    })();

    const summaryData = {
      bundle: answers.bundle === 'internet' ? 'Интернет' : answers.bundle === 'internet_tv' ? 'Интернет + ТВ' : 'Пакет услуг',
      people: answers.peopleCount === '1-2' ? '1–2 чел.' : answers.peopleCount === '3-4' ? '3–4 чел.' : '5+ чел.',
      tags: answers.featureTags.length > 0 ? answers.featureTags.map(t => t === 'gaming' ? 'Игры' : t === 'work' ? 'Работа' : t).join(', ') : 'Базовые задачи',
      strat: answers.budgetStrategy === 'min' ? 'Экономия' : answers.budgetStrategy === 'max' ? 'Максимум' : 'Баланс'
    };

    return {
      winner: processedWinner,
      alternatives: sorted.slice(1, 3),
      others: sorted.slice(3),
      summary: summaryData,
      fallbackAlert
    };

  }, [showResults, answers]);
};