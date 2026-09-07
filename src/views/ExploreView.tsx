import React, { useState } from 'react';
import { BookCard } from '../components/books/BookCard';
import { useApp } from '../context/AppContext';
import { Filter, Heart, Headphones, BookOpen } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { favorites, allBooks, allCategories } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'audio'>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const booksList = allBooks;
  const categoriesList = allCategories;

  const displayedBooks = booksList.filter((book) => {
    if (filterType === 'favorites') {
      if (!favorites.includes(book.id)) return false;
    }
    if (filterType === 'audio') {
      if (!book.hasAudio) return false;
    }
    if (selectedCat !== 'all' && book.categoryId !== selectedCat) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-jain-text flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-jain-maroon" />
            <span>अन्वेषण एवं सम्पूर्ण ग्रन्थावली</span>
          </h2>
          <p className="text-xs sm:text-sm text-jain-muted mt-0.5">
            सभी आगम गाथाएँ, तीर्थंकर चरित्र, एवं संस्कार साहित्य
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'favorites'
                ? 'bg-jain-maroon text-white shadow-xs'
                : 'bg-white border border-jain-border text-jain-muted hover:bg-jain-cream'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>पसंदीदा ({favorites.length})</span>
          </button>
          {/* <button
            onClick={() => setFilterType('audio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'audio'
                ? 'bg-jain-maroon text-white shadow-xs'
                : 'bg-white border border-jain-border text-jain-muted hover:bg-jain-cream'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>ऑडियो कथाएँ</span>
          </button> */}
        </div>
      </div>

      {/* Category Dropdown/Selector */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-jain-muted flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>श्रेणी:</span>
        </span>
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
              selectedCat === cat.id
                ? 'bg-jain-gold text-white font-bold'
                : 'bg-white border border-jain-border text-jain-text hover:bg-jain-cream'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of books */}
      {displayedBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-jain-border p-6">
          <span className="text-4xl">📚</span>
          <h4 className="text-sm font-bold text-jain-text mt-3">कोई ग्रंथ नहीं मिला</h4>
          <p className="text-xs text-jain-muted mt-1">
            कृपया अन्य फ़िल्टर चुनें
          </p>
        </div>
      )}
    </div>
  );
};
