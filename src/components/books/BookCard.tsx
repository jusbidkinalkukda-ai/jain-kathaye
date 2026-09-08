import React from 'react';
import { Heart, Headphones, Eye, BookOpen } from 'lucide-react';
import { Book } from '../../types';
import { useApp } from '../../context/AppContext';
import { LotusSymbol, SnakeSymbol, BullSymbol } from '../common/SpiritualSymbols';

interface BookCardProps {
  book: Book;
}

// Mini Jain rainbow / spiritual emblem badge on the top right of poster (from screenshot)
const JainArchBadge: React.FC = () => (
  <div className="w-5 h-5 rounded-full bg-white/95 p-0.5 shadow-xs flex items-center justify-center shrink-0" title="Jain Spiritual Emblem">
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
      {/* Three spiritual dots (Samyag Darshan, Jnana, Charitra) */}
      <circle cx="10" cy="14" r="2" fill="#E11D48" />
      <circle cx="16" cy="10" r="2" fill="#F59E0B" />
      <circle cx="22" cy="14" r="2" fill="#10B981" />
      {/* Crescent moon (Siddha Shila) */}
      <path d="M7 21C11 25 21 25 25 21C22 23 10 23 7 21Z" fill="#2563EB" />
    </svg>
  </div>
);

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { isFavorite, toggleFavorite, openReader, playAudioStory } = useApp();
  const favorite = isFavorite(book.id);

  // Extract clean uppercase title for top banner and bottom caption (e.g. "AIMUTTA MUNI")
  const rawTitle = book.titleEn || book.title;
  const uppercaseTitle = rawTitle
    .replace(/\(.*?\)/g, '')
    .replace(/ - .*/g, '')
    .trim()
    .toUpperCase();

  // Background gradient themes matching the illustration moods
  const getIllustrationTheme = (theme: Book['coverTheme']) => {
    switch (theme) {
      case 'green':
        return {
          bg: 'bg-gradient-to-b from-[#285A3A] via-[#35734A] to-[#1E432B]',
          accent: '#10B981',
        };
      case 'ochre':
        return {
          bg: 'bg-gradient-to-b from-[#8C3D0E] via-[#A84A12] to-[#6E2E0A]',
          accent: '#F97316',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-b from-[#8B670A] via-[#A67C0C] to-[#694E07]',
          accent: '#F59E0B',
        };
      case 'maroon':
      default:
        return {
          bg: 'bg-gradient-to-b from-[#781B14] via-[#94231A] to-[#5C140E]',
          accent: '#EF4444',
        };
    }
  };

  const themeConfig = getIllustrationTheme(book.coverTheme);

  return (
    <div
      onClick={() => openReader(book.id)}
      className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* 1. Poster Image Container (Aspect Ratio ~3:4 matching screenshot) */}
      <div className={`relative w-full aspect-[4/5] overflow-hidden ${themeConfig.bg} flex flex-col justify-between`}>
        {/* Real Cover Image if provided */}
        {book.coverImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>
        ) : (
          /* Rich stylized illustration fallback */
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4">
            {/* Subtle sun aura */}
            <div className="w-24 h-24 rounded-full bg-amber-400/20 blur-xl absolute" />
            <div className="relative z-10 text-white/90 group-hover:scale-110 transition-transform duration-500 flex flex-col items-center">
              {book.symbol === 'snake' ? (
                <SnakeSymbol className="w-16 h-16 drop-shadow-lg" />
              ) : book.symbol === 'bull' ? (
                <BullSymbol className="w-16 h-16 drop-shadow-lg" />
              ) : (
                <LotusSymbol className="w-16 h-16 drop-shadow-lg" />
              )}
            </div>
            {/* Spiritual halo or horizon pattern */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Top Dark Banner Overlay with Uppercase Title & Emblem (Exact match to screenshot!) */}
        <div className="relative z-10 bg-black/65 backdrop-blur-[2px] px-2.5 py-1.5 flex items-center justify-between border-b border-white/10">
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-white truncate max-w-[80%] font-sans drop-shadow">
            {uppercaseTitle}
          </span>
          <JainArchBadge />
        </div>

        {/* Favorite Heart Button (Top right beneath banner) & Audio indicator */}
        <div className="relative z-10 mt-auto p-2 flex items-center justify-between">
          {book.hasAudio ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playAudioStory(book);
              }}
              className="px-2 py-0.5 rounded-full bg-black/50 hover:bg-black/70 active:scale-95 text-white text-[10px] font-semibold flex items-center gap-1 border border-white/20 backdrop-blur-xs transition-colors"
              title="ऑडियो सुनें"
            >
              <Headphones className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">ऑडियो</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(book.id);
            }}
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 transition-all flex items-center justify-center backdrop-blur-xs border border-white/20"
            title={favorite ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                favorite ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Bottom Caption Container (Crisp White Background matching screenshot) */}
      <div className="p-2.5 sm:p-3 bg-white flex flex-col justify-between flex-1 gap-1.5 text-center">
        <div>
          {/* Main Uppercase Title (Centered and bold, exact match to screenshot) */}
          <h4 className="text-xs sm:text-sm font-black text-gray-800 tracking-wide uppercase truncate group-hover:text-[#EE7314] transition-colors">
            {uppercaseTitle}
          </h4>

          {/* Hindi Title Subheading */}
          <p className="text-[11px] text-gray-600 font-medium truncate mt-0.5">
            {book.title}
          </p>
        </div>

        {/* Metadata row: Chapter count, Reading Time & Views */}
        <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-600">
          <span className="font-semibold text-[#EE7314]">
            {book.badgeTag}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span>⏱️</span>
            <span>{book.chapters[0]?.readingTimeMinutes || 4} min</span>
          </span>
        </div>
      </div>
    </div>
  );
};

