import React from 'react';
import { Heart, Headphones, Star } from 'lucide-react';
import { Book } from '../../types';
import { useApp } from '../../context/AppContext';
import { SpiritualSymbolIcon } from '../common/SpiritualSymbols';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { isFavorite, toggleFavorite, openReader } = useApp();
  const favorite = isFavorite(book.id);

  // Background gradient based on coverTheme
  const getCoverBg = (theme: Book['coverTheme']) => {
    switch (theme) {
      case 'green':
        return 'bg-gradient-to-b from-[#1E5936] to-[#154026] text-white';
      case 'ochre':
        return 'bg-gradient-to-b from-[#A44E18] to-[#7C360E] text-white';
      case 'gold':
        return 'bg-gradient-to-b from-[#B8860B] to-[#8C6505] text-white';
      case 'maroon':
      default:
        return 'bg-gradient-to-b from-[#8F2018] to-[#6E1610] text-white';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-jain-border overflow-hidden shadow-jain-card hover:shadow-jain-elevated transition-all duration-300 flex flex-col group">
      {/* Upper Book Cover Area */}
      <div className={`relative p-3 sm:p-4 rounded-t-3xl min-h-[170px] sm:min-h-[195px] flex flex-col justify-between ${getCoverBg(book.coverTheme)}`}>
        {/* Top Header: Badge & Favorite Button */}
        <div className="flex items-center justify-between w-full z-10">
          <span className="bg-black/35 backdrop-blur-xs text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full text-white/95">
            {book.badgeTag}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(book.id);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-transform flex items-center justify-center backdrop-blur-xs"
            title={favorite ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
            aria-label="पसंदीदा"
          >
            <Heart
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                favorite ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Center Spiritual Emblem */}
        <div className="flex justify-center items-center my-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center p-2 shadow-inner border border-white/20 group-hover:scale-105 transition-transform">
            <SpiritualSymbolIcon symbol={book.symbol} className="w-10 h-10" />
          </div>
        </div>

        {/* Book Title on Cover */}
        <div className="text-center px-1">
          <h3 className="text-xs sm:text-sm font-bold line-clamp-1 text-white tracking-wide drop-shadow-xs">
            {book.title}
          </h3>
        </div>

        {/* Cover Bottom Badges: Chapter count & Audio */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[10px] sm:text-xs text-white/90">
          <span>{book.chapters.length} कथाएं</span>
          {book.hasAudio && (
            <span className="flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-md text-[9px] sm:text-[11px] font-medium">
              <Headphones className="w-3 h-3 text-jain-gold" />
              <span>ऑडियो</span>
            </span>
          )}
        </div>
      </div>

      {/* Lower Card Content: Metadata & Actions */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Main Title */}
          <h4
            onClick={() => openReader(book.id)}
            className="font-bold text-xs sm:text-sm text-jain-text line-clamp-2 hover:text-jain-maroon cursor-pointer transition-colors"
          >
            {book.title}
          </h4>

          {/* Author Attribution */}
          <p className="text-[11px] sm:text-xs text-jain-muted mt-1 truncate">
            ✍️ {book.author}
          </p>

          {/* Rating and Reader Count Row */}
          <div className="flex items-center justify-between mt-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <div className="text-jain-muted font-medium">
              {book.readersCount}
            </div>
          </div>
        </div>

        {/* Read Book CTA Button (Exact maroon button with right arrow) */}
        <button
          onClick={() => openReader(book.id)}
          className="w-full mt-1 bg-jain-maroon hover:bg-jain-maroon-dark active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-md"
        >
          <span>पुस्तक पढ़ें</span>
          <span className="transition-transform group-hover:translate-x-1">➔</span>
        </button>
      </div>
    </div>
  );
};
