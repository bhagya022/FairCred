import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/95 shadow-[0_20px_60px_rgba(120,53,15,0.08)] ${noPadding ? '' : 'p-6'} transition-colors hover:border-stone-300 ${className}`}>
      {children}
    </div>
  );
}
