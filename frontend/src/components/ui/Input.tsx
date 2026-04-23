import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-1.5 truncate text-[10px] font-bold uppercase tracking-widest text-stone-600">
          {label}
        </label>
      )}
      <input
        className={`rounded-xl border px-4 py-2.5 font-mono text-sm text-stone-900 shadow-inner transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 ${error ? 'border-red-300 bg-red-50/40 focus:ring-red-200' : 'border-stone-300 bg-stone-100 focus:border-amber-400 focus:ring-amber-200'} placeholder-stone-400 ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1.5 px-1 text-xs font-medium text-red-700">{error}</span>
      )}
    </div>
  );
}
