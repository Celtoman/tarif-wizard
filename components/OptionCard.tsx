import React from 'react';

type OptionCardProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export const OptionCard: React.FC<OptionCardProps> = ({ selected, onClick, children }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl border-2 text-left transition-all h-full flex flex-col items-start w-full ${
      selected 
      ? 'border-[#e30611] bg-red-50 shadow-md ring-1 ring-[#e30611]' 
      : 'border-[#e2e8f0] bg-white hover:border-slate-300 hover:shadow-sm'
    }`}
  >
    {children}
  </button>
);