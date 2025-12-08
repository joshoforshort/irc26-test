import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl mx-auto p-6 sm:p-8 border border-white/50 ${className}`}
    >
      {children}
    </div>
  );
}

