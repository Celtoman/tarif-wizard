import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CalculationResult } from '../types';
import { Check, Tv, Smartphone, AlertTriangle, Gift, Rocket, CheckCircle, RefreshCw } from 'lucide-react';

interface ResultsViewProps {
  data: CalculationResult;
  onReset: () => void;
  onEdit: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset, onEdit }) => {
  const { winner, alternatives, others, summary, fallbackAlert } = data;

  if (!winner) return null;

  const BadgeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'gift': return <Gift size={16} />;
      case 'upsell': return <Rocket size={16} />;
      case 'warn': return <AlertTriangle size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'gift': return 'bg-purple-600';
      case 'upsell': return 'bg-indigo-600';
      case 'gaming': return 'bg-emerald-600';
      case 'warn': return 'bg-yellow-600';
      default: return 'bg-[#e30611]';
    }
  };

  return (
    <Section title="Результаты подбора">
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h3 className="font-bold text-lg mb-2">Под ваши ответы:</h3>
           {summary && (
             <div className="flex flex-wrap gap-2 text-sm text-slate-700">
               <span className="bg-white border border-[#e2e8f0] px-2 py-1 rounded">📦 {summary.bundle}</span>
               <span className="bg-white border border-[#e2e8f0] px-2 py-1 rounded">👥 {summary.people}</span>
               <span className="bg-white border border-[#e2e8f0] px-2 py-1 rounded">🎯 {summary.tags}</span>
               <span className="bg-white border border-[#e2e8f0] px-2 py-1 rounded">⚖️ {summary.strat}</span>
             </div>
           )}
         </div>
         <Button variant="outline" onClick={onEdit} className="bg-white whitespace-nowrap">
           <RefreshCw size={14} className="mr-2"/> Изменить ответы
         </Button>
      </div>

      {fallbackAlert && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg flex items-start gap-3">
           <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
           <p className="text-sm text-yellow-800">{fallbackAlert}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Winner Card */}
        <div className="lg:col-span-1 relative">
          <div className={`absolute -top-4 left-0 right-0 z-20 mx-4 py-2 px-4 rounded-t-xl flex items-center gap-2 shadow-lg text-white font-bold text-xs uppercase tracking-wide ${getBadgeColor(winner.badge?.type || 'default')}`}>
            {winner.badge && <BadgeIcon type={winner.badge.type} />}
            {winner.badge?.title}
          </div>
          
          <Card className="h-full border-2 border-red-100 hover:border-red-500 pt-12 shadow-xl relative overflow-hidden flex flex-col transition-colors">
             <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">
               {Math.round(winner.score) > 0 ? Math.round(winner.score) : 0} баллов
             </div>
             <div className="mb-4">
               <h4 className="font-bold text-2xl leading-tight mb-2 text-[#0f172a]">{winner.name}</h4>
               {winner.badge && (
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-snug">
                   {winner.badge.text}
                 </div>
               )}
             </div>

             <div className="flex items-baseline gap-2 mb-2">
               <span className="text-4xl font-extrabold text-[#0f172a]">{winner.price} ₽</span>
               <span className="text-sm text-[#64748b]">/мес</span>
             </div>
             <div className="text-xs text-[#64748b] mb-6">
               {winner.oldPrice ? `Базовая цена: ${winner.oldPrice} ₽` : 'Цена фиксирована'}
             </div>

             <div className="space-y-3 mb-6 flex-grow">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-50 text-[#e30611] flex items-center justify-center font-bold text-xs">🚀</div>
                 <div className="text-sm font-bold">{winner.speed} Мбит/с</div>
               </div>
               {winner.hasTv && (
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Tv size={16}/></div>
                   <div className="text-sm font-bold">ТВ включено</div>
                 </div>
               )}
               {winner.hasSim && (
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Smartphone size={16}/></div>
                   <div className="text-sm font-bold">Мобильная связь</div>
                 </div>
               )}
               <div className="pt-3 border-t border-dashed border-[#e2e8f0]">
                 <div className="text-xs font-semibold text-[#64748b] mb-1">Почему мы его выбрали:</div>
                 <ul className="text-xs text-slate-600 space-y-1">
                   {winner.reasons.slice(0, 3).map((r, i) => <li key={i} className="flex gap-2"><Check size={12} className="text-green-500 mt-0.5"/> {r}</li>)}
                 </ul>
               </div>
             </div>

             <Button variant="primary" fullWidth className="text-base py-3">Подключить</Button>
          </Card>
        </div>

        {/* Alternatives */}
        <div className="lg:col-span-2 space-y-4">
           <h4 className="font-bold text-[#64748b] text-sm uppercase tracking-wider">Альтернативные варианты</h4>
           {alternatives.map(t => (
             <Card key={t.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:shadow-md transition-shadow">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <h5 className="font-bold text-lg text-[#0f172a]">{t.name}</h5>
                   <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{Math.round(t.score) > 0 ? Math.round(t.score) : 0} баллов</span>
                   {t.speed >= 500 && <span className="text-[10px] bg-red-50 text-[#e30611] px-2 py-0.5 rounded font-bold">{t.speed} Мбит</span>}
                 </div>
                 <ul className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                   {t.features.slice(0,3).map((f,i) => <li key={i}>• {f}</li>)}
                 </ul>
               </div>
               <div className="flex items-center gap-4 shrink-0">
                 <div className="text-right">
                   <div className="text-xl font-bold text-[#0f172a]">{t.price} ₽</div>
                   {t.oldPrice && <div className="text-xs text-[#64748b] line-through">{t.oldPrice} ₽</div>}
                 </div>
                 <Button variant="secondary" className="px-3 py-1.5 text-xs">Подробнее</Button>
               </div>
             </Card>
           ))}
           
           {others.length > 0 && (
             <div className="pt-4 mt-8 border-t border-[#e2e8f0]">
               <h4 className="font-bold text-[#64748b] text-sm uppercase tracking-wider mb-4">Другие тарифы</h4>
               <div className="space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                  {others.slice(0, 3).map(t => (
                     <div key={t.id} className="flex justify-between items-center p-3 bg-white border border-[#e2e8f0] rounded-lg">
                        <span className="font-medium text-sm text-[#0f172a]">{t.name}</span>
                        <span className="text-sm font-bold text-slate-600">{t.price} ₽</span>
                     </div>
                  ))}
               </div>
               <button className="text-xs text-[#e30611] mt-4 underline" onClick={onReset}>Показать все тарифы без учёта моих ответов</button>
             </div>
           )}
        </div>
      </div>
    </Section>
  );
};