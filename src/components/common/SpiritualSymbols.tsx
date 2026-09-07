import React from 'react';
import { SpiritualSymbolType } from '../../types';

interface SymbolProps {
  className?: string;
  size?: number;
}

export const SwastikOmBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-jain-cream text-jain-maroon font-bold flex items-center justify-center shadow-md border-2 border-jain-gold/60 select-none`}
      title="卐 ॐ - शुभ व शाश्वत प्रतीक"
    >
      <span className="font-serif tracking-tight font-extrabold text-jain-maroon">卐 ॐ</span>
    </div>
  );
};

export const LotusSymbol: React.FC<SymbolProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Spiritual Sacred Lotus */}
    <ellipse cx="50" cy="50" rx="36" ry="36" fill="#FFF0B8" fillOpacity="0.25" />
    <path
      d="M50 20C46 32 36 44 26 56C36 58 46 54 50 64C54 54 64 58 74 56C64 44 54 32 50 20Z"
      fill="#F472B6"
      stroke="#DB2777"
      strokeWidth="1.5"
    />
    <path
      d="M50 30C48 40 40 48 34 56C42 57 48 55 50 62C52 55 58 57 66 56C60 48 52 40 50 30Z"
      fill="#FBCFE8"
    />
    <path
      d="M32 46C22 52 14 62 18 72C28 72 38 66 44 60C38 56 34 50 32 46Z"
      fill="#F472B6"
      stroke="#DB2777"
      strokeWidth="1.5"
    />
    <path
      d="M68 46C78 52 86 62 82 72C72 72 62 66 56 60C62 56 66 50 68 46Z"
      fill="#F472B6"
      stroke="#DB2777"
      strokeWidth="1.5"
    />
    <path
      d="M26 68C32 74 42 76 50 76C58 76 68 74 74 68C66 70 58 68 50 71C42 68 34 70 26 68Z"
      fill="#BE185D"
    />
    <circle cx="50" cy="52" r="3.5" fill="#F59E0B" />
  </svg>
);

export const SnakeSymbol: React.FC<SymbolProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bhagwan Parshvanath Phani / Serpent Hood Symbol */}
    <ellipse cx="50" cy="50" rx="36" ry="36" fill="#E2E8F0" fillOpacity="0.2" />
    <path
      d="M50 18C44 26 34 22 28 30C24 35 26 42 32 44C36 45 42 42 46 45C50 47 50 56 46 62C40 70 34 74 40 82C45 88 56 86 62 80C70 72 68 62 62 54C58 48 58 44 62 40C66 36 68 28 62 22C58 18 54 16 50 18Z"
      fill="#86EFAC"
      stroke="#16A34A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="42" cy="28" r="2.5" fill="#14532D" />
    <path d="M46 72C50 70 54 70 58 74" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 60C48 58 52 58 56 62" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BullSymbol: React.FC<SymbolProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rishabhdev Vrishabha Symbol */}
    <ellipse cx="50" cy="50" rx="36" ry="36" fill="#FEF3C7" fillOpacity="0.3" />
    <path
      d="M32 26C30 36 34 46 42 50C40 56 42 68 50 72C58 68 60 56 58 50C66 46 70 36 68 26C64 34 58 38 50 38C42 38 36 34 32 26Z"
      fill="#FDE68A"
      stroke="#D97706"
      strokeWidth="2.5"
    />
    <circle cx="50" cy="56" r="4" fill="#B45309" />
  </svg>
);

export const ConchSymbol: React.FC<SymbolProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Neminath Shankha Symbol */}
    <ellipse cx="50" cy="50" rx="36" ry="36" fill="#E0F2FE" fillOpacity="0.3" />
    <path
      d="M45 22C35 30 32 46 36 60C38 68 46 76 54 78C64 78 70 70 70 60C70 48 64 38 56 30C52 26 48 22 45 22Z"
      fill="#BAE6FD"
      stroke="#0284C7"
      strokeWidth="2.5"
    />
    <path d="M46 36C50 42 54 50 54 62" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LionSymbol: React.FC<SymbolProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mahavira Simha Lanchan Symbol */}
    <ellipse cx="50" cy="50" rx="36" ry="36" fill="#FEE2E2" fillOpacity="0.3" />
    <circle cx="50" cy="46" r="16" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2" />
    <circle cx="44" cy="44" r="2.5" fill="#7F1D1D" />
    <circle cx="56" cy="44" r="2.5" fill="#7F1D1D" />
    <path d="M46 52C48 54 52 54 54 52" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 46C26 56 34 68 44 72C50 74 56 74 62 70C68 64 74 54 70 46" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

export const SpiritualSymbolIcon: React.FC<{ symbol: SpiritualSymbolType; className?: string }> = ({
  symbol,
  className = "w-10 h-10",
}) => {
  switch (symbol) {
    case 'snake':
      return <SnakeSymbol className={className} />;
    case 'bull':
      return <BullSymbol className={className} />;
    case 'conch':
      return <ConchSymbol className={className} />;
    case 'lion':
      return <LionSymbol className={className} />;
    case 'om-swastik':
      return <SwastikOmBadge size="sm" />;
    case 'lotus':
    default:
      return <LotusSymbol className={className} />;
  }
};
