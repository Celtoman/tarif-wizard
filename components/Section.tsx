import React from 'react';

type SectionProps = { 
  title?: string; 
  children: React.ReactNode; 
  className?: string; 
};

export const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => (
  <section className={`max-w-[1200px] mx-auto px-4 py-8 ${className}`}>
    {title && <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#0f172a]">{title}</h2>}
    {children}
  </section>
);