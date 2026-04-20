import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden ${noPadding ? '' : 'p-6'} hover:border-slate-700/80 transition-colors ${className}`}>
      {children}
    </div>
  );
}
