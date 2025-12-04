import React, { useState } from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { OptionCard } from '../components/OptionCard';
import { Answers, FeatureTag } from '../types';
import { UI_COPY } from '../constants';
import { 
  Laptop, Tv, Smartphone, Zap, Users, Briefcase, Gamepad2, Download, Video, Search, 
  ArrowLeft, ChevronRight, X 
} from 'lucide-react';

interface WizardViewProps {
  initialAnswers: Answers;
  onComplete: (answers: Answers) => void;
  onCancel: () => void;
  stepIdx?: number;
}

export const WizardView: React.FC<WizardViewProps> = ({ initialAnswers, onComplete, onCancel, stepIdx = 1 }) => {
  const [step, setStep] = useState<number>(stepIdx);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && !answers.bundle) {
      setValidationError("Пожалуйста, выберите тип подключения, чтобы продолжить.");
      return;
    }
    setValidationError(null);

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
    setValidationError(null);
  };

  const currentStepTitle = UI_COPY.steps[step as 1|2|3|4]?.title;
  const currentStepSubtitle = UI_COPY.steps[step as 1|2|3|4]?.subtitle;

  return (
    <Section title="Помощник выбора тарифа">
      <Card className="min-h-[500px] flex flex-col p-0 overflow-hidden bg-white mt-4">
        <div className="bg-slate-50 border-b border-[#e2e8f0] p-4 md:px-8">
           <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Шаг {step} из {totalSteps}</span>
             <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
           </div>
           
           <div className="hidden md:flex justify-between relative px-2">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
              {['Услуги', 'Нагрузка', 'Специфика', 'Бюджет'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === step;
                const isPassed = stepNum < step;
                return (
                  <div key={idx} className="flex flex-col items-center bg-slate-50 px-4">
                    <div className={`w-3 h-3 rounded-full mb-2 transition-colors ${isActive || isPassed ? 'bg-[#e30611]' : 'bg-slate-300'}`}></div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-[#0f172a]' : 'text-slate-400'}`}>{label}</span>
                  </div>
                );
              })}
           </div>
           <div className="md:hidden w-full h-1.5 bg-slate-200 rounded-full">
             <div className="h-full bg-[#e30611] rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
           </div>
        </div>

        <div className="flex-grow p-6 md:p-8 flex flex-col animate-fade-in">
           <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">{currentStepTitle}</h3>
           <p className="text-sm text-[#64748b] mb-6">{currentStepSubtitle}</p>

           {step === 1 && (
             <>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { id: 'internet', l: 'Только Интернет', d: 'Просто быстрый домашний интернет', i: <Laptop className="w-6 h-6"/> },
                   { id: 'internet_tv', l: 'Интернет + ТВ', d: 'Домашний интернет и цифровое ТВ', i: <Tv className="w-6 h-6"/> },
                   { id: 'internet_mobile', l: 'Интернет + Моб. связь', d: 'Интернет и мобильные ГБ/минуты', i: <Smartphone className="w-6 h-6"/> },
                   { id: 'all', l: 'Всё сразу', d: 'Максимальный пакет услуг', i: <Zap className="w-6 h-6"/> },
                 ].map(opt => (
                   <OptionCard 
                     key={opt.id} 
                     selected={answers.bundle === opt.id} 
                     onClick={() => setAnswers({...answers, bundle: opt.id as any})}
                   >
                     <div className={`mb-3 ${answers.bundle === opt.id ? 'text-[#e30611]' : 'text-slate-400'}`}>{opt.i}</div>
                     <div className="font-bold mb-1">{opt.l}</div>
                     <div className="text-xs text-slate-500">{opt.d}</div>
                   </OptionCard>
                 ))}
               </div>
               {validationError && <p className="text-sm text-red-500 mt-4 text-center animate-bounce">{validationError}</p>}
             </>
           )}

           {step === 2 && (
             <div className="grid md:grid-cols-3 gap-4">
                {[
                  { val: '1-2', label: '1–2 человека', sub: 'Обычно 2–4 устройства онлайн.', icon: <Users className="w-6 h-6"/> },
                  { val: '3-4', label: '3–4 человека', sub: '4–8 устройств: ноутбуки, ТВ.', icon: <Users className="w-8 h-8"/> },
                  { val: '5+', label: '5 и больше', sub: 'Много устройств, умный дом.', icon: <Users className="w-10 h-10"/> },
                ].map((opt) => (
                  <OptionCard 
                    key={opt.val} 
                    selected={answers.peopleCount === opt.val} 
                    onClick={() => setAnswers({...answers, peopleCount: opt.val as any})}
                  >
                    <div className={`mb-3 ${answers.peopleCount === opt.val ? 'text-[#e30611]' : 'text-slate-400'}`}>{opt.icon}</div>
                    <div className="font-bold mb-1">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.sub}</div>
                  </OptionCard>
                ))}
             </div>
           )}

           {step === 3 && (
             <>
               <div className="flex flex-wrap gap-3">
                 {[
                   { id: 'work', label: 'Работа и учёба', sub: 'Видеозвонки, VPN', icon: <Briefcase size={18}/> },
                   { id: 'cinema', label: 'Фильмы и сериалы', sub: 'HD/4K, Кинотеатры', icon: <Tv size={18}/> },
                   { id: 'gaming', label: 'Онлайн-игры', sub: 'Низкий пинг', icon: <Gamepad2 size={18}/> },
                   { id: 'download', label: 'Скачивание файлов', sub: 'Торренты, архивы', icon: <Download size={18}/> },
                   { id: 'cctv', label: 'Умный дом / Камеры', sub: 'Видеонаблюдение', icon: <Video size={18}/> },
                   { id: 'browsing', label: 'Только серфинг', sub: 'Сайты, новости', icon: <Search size={18}/> },
                 ].map((opt) => {
                   const isSelected = answers.featureTags.includes(opt.id as FeatureTag);
                   return (
                     <button
                       key={opt.id}
                       onClick={() => {
                         const newTags = isSelected
                           ? answers.featureTags.filter(f => f !== opt.id)
                           : [...answers.featureTags, opt.id as FeatureTag];
                         setAnswers({...answers, featureTags: newTags});
                       }}
                       className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border transition-all w-[48%] md:w-[30%] text-left ${
                         isSelected 
                         ? 'border-[#e30611] bg-red-50 text-[#e30611] ring-1 ring-[#e30611]' 
                         : 'border-[#e2e8f0] bg-white hover:border-slate-300 text-[#0f172a]'
                       }`}
                     >
                       <div className="flex items-center gap-2 font-medium text-sm">
                          {opt.icon} {opt.label}
                       </div>
                       <div className="text-xs opacity-70 pl-6 hidden md:block">{opt.sub}</div>
                     </button>
                   );
                 })}
               </div>
             </>
           )}

           {step === 4 && (
             <div className="grid gap-3">
               {[
                 { id: 'min', l: 'Минимальный платёж', d: 'Хочу платить как можно меньше, скорость — вторично.' },
                 { id: 'balanced', l: 'Оптимальный баланс', d: 'И цена, и скорость важны примерно одинаково.' },
                 { id: 'max', l: 'Максимум скорости', d: 'Готов доплатить за максимальную скорость и стабильность.' },
               ].map(opt => (
                 <div 
                   key={opt.id}
                   onClick={() => setAnswers({...answers, budgetStrategy: opt.id as any})}
                   className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                     answers.budgetStrategy === opt.id ? 'border-[#e30611] bg-red-50 ring-1 ring-[#e30611]' : 'border-[#e2e8f0] hover:border-slate-300'
                   }`}
                 >
                   <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${answers.budgetStrategy === opt.id ? 'border-[#e30611]' : 'border-slate-300'}`}>
                      {answers.budgetStrategy === opt.id && <div className="w-2.5 h-2.5 bg-[#e30611] rounded-full" />}
                   </div>
                   <div>
                     <div className="font-bold text-sm text-[#0f172a]">{opt.l}</div>
                     <div className="text-xs text-[#64748b]">{opt.d}</div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50 flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} disabled={step <= 1} className={`text-slate-500 ${step <= 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ArrowLeft size={16} className="mr-2"/> Назад
          </Button>
          <Button variant="primary" onClick={handleNext} className="px-8 min-w-[140px]">
             {step === totalSteps ? 'Подобрать' : 'Дальше'} <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </Card>
    </Section>
  );
};