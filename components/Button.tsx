import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'secondary', fullWidth, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    primary: "bg-[#e30611] hover:bg-[#cc0000] text-white shadow-lg shadow-red-500/20",
    secondary: "bg-white hover:bg-gray-50 text-[#0f172a] border border-[#e2e8f0] shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 text-[#64748b] hover:text-[#0f172a]",
    outline: "bg-transparent border border-[#e2e8f0] hover:border-slate-400 text-[#0f172a]"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} px-5 py-2.5 text-sm ${className}`} {...props}>
      {children}
    </button>
  );
};