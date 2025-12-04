import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { TARIFFS_DATA } from '../constants';

export const LoadingView: React.FC = () => {
  return (
    <Section className="!py-0">
       <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center mt-10">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-[#e30611] rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-bold mb-2">Подбираем тарифы...</h3>
          <p className="text-sm text-[#64748b]">Сравниваем {TARIFFS_DATA.length} предложений</p>
       </Card>
     </Section>
  );
};