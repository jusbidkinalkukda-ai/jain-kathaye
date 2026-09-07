import React from 'react';
import { Book, Category } from '../../types';
import { BookCard } from './BookCard';
import { LotusSymbol } from '../common/SpiritualSymbols';
import { useApp } from '../../context/AppContext';

interface BookSectionProps {
  category: Category;
  books: Book[];
  description?: string;
}

export const BookSection: React.FC<BookSectionProps> = ({
  category,
  books,
  description,
}) => {
  const { setSelectedCategory } = useApp();

  if (books.length === 0) return null;

  return (
    <div className="bg-[#FFFDF8] rounded-3xl border border-jain-border/90 p-3.5 sm:p-5 shadow-jain-card mb-6 overflow-hidden">
      {/* Section Header Row */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-jain-border/60">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-jain-cream border border-jain-gold/40 flex items-center justify-center p-1.5 shadow-xs shrink-0">
            <LotusSymbol className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-jain-text">
                {category.name}
              </h3>
              {category.badge && (
                <span className="bg-[#FFF0B8] text-jain-maroon text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-jain-gold/30">
                  {category.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-jain-muted font-medium">
              {description || category.nameEn}
            </p>
          </div>
        </div>

        {/* Expand / View All button (विस्तार ➔) */}
        <button
          onClick={() => setSelectedCategory(category.id)}
          className="bg-[#FFF8EC] hover:bg-[#FFF0B8] text-jain-maroon active:scale-95 text-xs font-bold px-3 py-1.5 rounded-xl border border-jain-gold/30 transition-all flex items-center gap-1 shadow-xs shrink-0"
        >
          <span>विस्तार</span>
          <span className="text-sm">➔</span>
        </button>
      </div>

      {/* Book Cards Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
