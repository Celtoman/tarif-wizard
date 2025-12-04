import React from 'react';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { UI_COPY } from '../constants';

interface IntroViewProps {
  onStart: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  return (
    <Section className="!py-0">
      <div className="bg-gradient-to-br from-[#0f1220] to-[#1a202c] text-white p-8 md:p-12 text-center relative overflow-hidden rounded-2xl shadow-xl mt-10">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e30611] to-purple-600"></div>
         <h3 className="text-3xl font-bold mb-4">{UI_COPY.wizard.title}</h3>
         <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">{UI_COPY.wizard.subtitle}</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Button variant="primary" onClick={onStart} className="px-10 text-lg">
             {UI_COPY.wizard.btnStart}
           </Button>
           <button className="text-sm text-slate-400 hover:text-white underline decoration-dashed underline-offset-4">
             {UI_COPY.wizard.btnLink}
           </button>
         </div>
      </div>
    </Section>
  );
};