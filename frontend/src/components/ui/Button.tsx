import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, children, className = '', ...props }: ButtonProps) {
  const baseStyle = "font-bold rounded-xl shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 tracking-wide flex items-center justify-center px-6 py-2.5";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/20";
      break;
    case 'secondary':
      variantStyle = "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700";
      break;
    case 'danger':
      variantStyle = "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20";
      break;
    case 'ghost':
      variantStyle = "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200 shadow-none";
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
           <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
}
