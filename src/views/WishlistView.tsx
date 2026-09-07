import React, { useEffect } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/books/BookCard';

export const WishlistView: React.FC = () => {
  const {
    wishlistBooks,
    isLoadingWishlist,
    wishlistError,
    refreshWishlist,
  } = useApp();

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-jain-text flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <span>मेरी विशलिस्ट</span>
          </h2>
          <p className="text-xs sm:text-sm text-jain-muted mt-0.5">
            आपकी पसंदीदा जैन कथाएँ
          </p>
        </div>
        <button
          type="button"
          onClick={refreshWishlist}
          disabled={isLoadingWishlist}
          className="p-2 rounded-xl border border-jain-border bg-white text-jain-maroon hover:bg-jain-cream disabled:opacity-50 transition-colors"
          title="विशलिस्ट रीफ्रेश करें"
          aria-label="विशलिस्ट रीफ्रेश करें"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingWishlist ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {wishlistError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <p>{wishlistError}</p>
          <button
            type="button"
            onClick={refreshWishlist}
            className="mt-2 font-bold underline"
          >
            पुनः प्रयास करें
          </button>
        </div>
      )}

      {isLoadingWishlist ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-80 rounded-3xl bg-white border border-jain-border animate-pulse" />
          ))}
        </div>
      ) : wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {wishlistBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-jain-border p-6">
          <Heart className="w-10 h-10 mx-auto text-jain-gold" />
          <h4 className="text-sm font-bold text-jain-text mt-3">विशलिस्ट खाली है</h4>
          <p className="text-xs text-jain-muted mt-1">
            कथाओं पर दिए दिल के बटन से उन्हें यहाँ जोड़ें।
          </p>
        </div>
      )}
    </div>
  );
};
