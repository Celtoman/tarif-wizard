import React from 'react';

type CardProps = { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
};

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);