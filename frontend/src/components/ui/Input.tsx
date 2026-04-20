import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 truncate">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2.5 bg-slate-950 border ${error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-slate-800 focus:ring-sky-500/50 focus:border-sky-500/50'} rounded-xl text-slate-200 focus:outline-none focus:ring-2 transition-colors shadow-inner font-mono text-sm disabled:opacity-50 placeholder-slate-700 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 font-medium mt-1.5 px-1">{error}</span>
      )}
    </div>
  );
}
