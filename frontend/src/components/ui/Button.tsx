import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, children, className = '', ...props }: ButtonProps) {
  const baseStyle = "font-bold rounded-xl shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 tracking-wide flex items-center justify-center px-6 py-2.5";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white shadow-amber-900/20";
      break;
    case 'secondary':
      variantStyle = "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200";
      break;
    case 'danger':
      variantStyle = "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200";
      break;
    case 'ghost':
      variantStyle = "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 shadow-none";
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
