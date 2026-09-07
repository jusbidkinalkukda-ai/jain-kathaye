import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryPills } from '../components/books/CategoryPills';
import { BookSection } from '../components/books/BookSection';
import { BookCard } from '../components/books/BookCard';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mapApiBlogToBook } from '../api';
import { API_BASE_URL } from '../api/axiosClient';

export const HomeView: React.FC = () => {
  const {
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    allBooks,
    allCategories,
    landingSections,
    isLoadingLanding,
    landingError,
    refreshLanding,
  } = useApp();

  // Filter books based on search query or selected category
  const filteredBooks = allBooks.filter((book) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.badgeTag.toLowerCase().includes(query) ||
      (book.tags && book.tags.some((t) => t.toLowerCase().includes(query))) ||
      book.chapters.some(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.content.some((p) => p.toLowerCase().includes(query))
      );

    const matchesCategory =
      selectedCategory === 'all' ||
      book.categoryId === selectedCategory ||
      (book.tags && book.tags.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  const currentSelectedCat = allCategories.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 pb-24 md:pb-12">
      {/* 1. Category Pills Row */}
      <CategoryPills />

      {/* API Connection & Sync Status Banner */}
      <div className="my-2 flex items-center justify-between px-1 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">सर्वर लाइव:</span>
          <span className="text-emerald-700 font-mono text-[10px] sm:text-[11px]">
            {API_BASE_URL}
          </span>
        </div>

        <button
          onClick={() => refreshLanding()}
          disabled={isLoadingLanding}
          className="flex items-center gap-1 text-jain-maroon hover:text-jain-maroon-dark bg-[#FFF8EC] hover:bg-[#FFF0B8] px-2.5 py-1 rounded-full border border-jain-gold/40 transition-all active:scale-95 disabled:opacity-50"
          title="ताज़ा करें"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingLanding ? 'animate-spin' : ''}`} />
          <span className="font-medium">रिफ्रेश</span>
        </button>
      </div>

      {/* Error Alert with Retry button if API failed */}
      {landingError && (
        <div className="my-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">सर्वर से जुड़ने में समस्या</p>
              <p className="text-xs text-rose-700">{landingError}</p>
            </div>
          </div>
          <button
            onClick={() => refreshLanding()}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
          >
            पुनः प्रयास
          </button>
        </div>
      )}

      {/* If Search Active or Specific Category Selected, show clean grid view */}
      {searchQuery.trim() !== '' || selectedCategory !== 'all' ? (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm sm:text-base text-jain-text">
              {searchQuery
                ? `खोज परिणाम: "${searchQuery}"`
                : `${currentSelectedCat?.name || 'चयनित श्रेणी'}`}
              <span className="text-xs font-normal text-jain-muted ml-2">
                ({filteredBooks.length} कथाएं उपलब्ध)
              </span>
            </h3>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-jain-maroon font-bold hover:underline"
            >
              सभी देखें
            </button>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-jain-border p-6">
              <span className="text-4xl">🔍</span>
              <h4 className="text-sm font-bold text-jain-text mt-3">कोई कथा नहीं मिली</h4>
              <p className="text-xs text-jain-muted mt-1">
                कृपया अन्य शब्द खोजें
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Default Home Feed: Dynamic API Landing Sections only */
        <div>
          {/* Loading Skeleton during initial fetch */}
          {isLoadingLanding && landingSections.length === 0 && (
            <div className="space-y-6 my-4 animate-pulse">
              <div className="bg-white rounded-3xl p-5 border border-jain-border">
                <div className="h-6 w-48 bg-amber-100 rounded-lg mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-amber-50 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic API Landing Sections */}
          {landingSections.map((section) => {
            const sectionCategory = {
              id: section._id,
              name: section.name,
              nameEn: section.description || 'Jain Kathayein',
              icon: 'Sparkles',
              bookCount: section.blog_count ?? section.blogs.length,
              badge: `${section.blog_count ?? section.blogs.length} कथाएँ`,
            };

            const sectionBooks = section.blogs.map((b) =>
              mapApiBlogToBook(b, section.name)
            );

            return (
              <BookSection
                key={section._id}
                category={sectionCategory}
                books={sectionBooks}
                description={section.description}
              />
            );
          })}

          {/* Empty State if API returned zero landing sections */}
          {!isLoadingLanding && landingSections.length === 0 && !landingError && (
            <div className="text-center py-16 bg-white rounded-3xl border border-jain-border p-6 my-6">
              <span className="text-4xl">📖</span>
              <h4 className="text-sm font-bold text-jain-text mt-3">कोई कथा उपलब्ध नहीं है</h4>
              <p className="text-xs text-jain-muted mt-1">
                सर्वर पर वर्तमान में कोई प्रकाशित कथा नहीं है।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
