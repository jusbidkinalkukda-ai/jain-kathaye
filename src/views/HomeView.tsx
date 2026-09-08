import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CategorySidebar } from '../components/navigation/CategorySidebar';
import { CategoryPills } from '../components/books/CategoryPills';
import { BookCard } from '../components/books/BookCard';
import { RefreshCw, AlertCircle, Layers, SlidersHorizontal, Sparkles } from 'lucide-react';
import { mapApiBlogToBook } from '../api';
import { Book } from '../types';

export const HomeView: React.FC = () => {
  const {
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    allBooks,
    allCategories,
    landingSections,
    isLoadingLanding,
    landingError,
    refreshLanding,
  } = useApp();

  // Mobile sidebar drawer state
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Infinite scroller pagination state
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Compute all filtered books based on search or active category
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allBooks.filter((book) => {
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.badgeTag.toLowerCase().includes(query) ||
        (book.titleEn && book.titleEn.toLowerCase().includes(query)) ||
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
  }, [allBooks, searchQuery, selectedCategory]);

  // Books to show according to infinite scroll limit
  const visibleBooks = useMemo(() => {
    return filteredBooks.slice(0, visibleCount);
  }, [filteredBooks, visibleCount]);

  const hasMore = visibleBooks.length < filteredBooks.length;

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          // Smooth simulated loading delay for natural reading feel
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8);
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery]);

  const currentCategoryObj = allCategories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen jainworld-bg-pattern jain-mandala-watermark py-4 sm:py-6 px-3 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter & Categories Toggle Bar (<1024px) */}
        <div className="lg:hidden mb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-bold shadow-xs active:scale-98 transition-all"
            >
              <Layers className="w-4 h-4 text-[#EE7314]" />
              <span>
                {showMobileSidebar ? 'अनुक्रमणिका बंद करें ✕' : '📁 विषय व कथा अनुक्रमणिका (Index)'}
              </span>
            </button>
            <button
              onClick={() => refreshLanding()}
              disabled={isLoadingLanding}
              className="p-2 rounded-xl bg-white border border-gray-300 text-gray-700 active:scale-95 transition-all disabled:opacity-50 shadow-xs"
              title="रिफ्रेश करें"
            >
              <RefreshCw className={`w-4 h-4 text-[#EE7314] ${isLoadingLanding ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Expandable Mobile Sidebar Drawer */}
          {showMobileSidebar && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <CategorySidebar onStorySelect={() => setShowMobileSidebar(false)} />
            </div>
          )}

          {/* Horizontal Category Pills on Mobile */}
          <CategoryPills />
        </div>

        {/* Server Connection Error Alert if API fetch fails */}
        {landingError && (
          <div className="my-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{landingError}</span>
            </div>
            <button
              onClick={() => refreshLanding()}
              className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700 transition-colors"
            >
              पुनः प्रयास
            </button>
          </div>
        )}

        {/* Main 2-Column Responsive Layout matching Screenshot */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Categories & Story Navigation Tree (Desktop) */}
          {/* ======================================================== */}
          <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-6">
            <CategorySidebar />
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Blogs & Stories Main Showcase (Desktop)    */}
          {/* ======================================================== */}
          <div className="flex-1 min-w-0 w-full">
            {/* Header matching Screenshot ("Jain Stories" with clean horizontal line) */}
            <div className="flex items-center justify-between pb-1 border-b border-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-jain-text tracking-tight">
                  {searchQuery
                    ? `खोज परिणाम: "${searchQuery}"`
                    : currentCategoryObj?.id === 'all'
                    ? 'Jain Kathayein'
                    : currentCategoryObj?.name || 'Jain Kathayein'}
                </h2>
                <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                  ({filteredBooks.length} कथाएं)
                </span>
              </div>

              {/* Refresh / Reset Filters Button */}
              {(selectedCategory !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#EE7314] hover:text-[#C2410C] font-bold hover:underline"
                >
                  सभी देखें (View All)
                </button>
              )}
            </div>

            {/* Sub-header: Centered "STORIES" from Screenshot */}
            <div className="flex items-center justify-center my-3 sm:my-4">
              <div className="relative flex items-center">
                <div className="w-12 h-[1px] bg-gray-300" />
                <span className="mx-3 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-700 bg-white/90 px-3 py-0.5 rounded-md border border-gray-200/80 shadow-2xs">
                  STORIES
                </span>
                <div className="w-12 h-[1px] bg-gray-300" />
              </div>
            </div>

            {/* 4-Column Poster Grid matching Screenshot */}
            {visibleBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {visibleBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="text-center py-16 bg-white/90 rounded-3xl border border-gray-200 p-8 shadow-xs">
                <span className="text-4xl">🔍</span>
                <h3 className="text-base font-bold text-gray-800 mt-3">कोई कथा नहीं मिली</h3>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                  आपकी खोज "{searchQuery}" से संबंधित कोई कथा उपलब्ध नहीं है। कृपया कोई अन्य शब्द खोजें।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-[#EE7314] hover:bg-[#C2410C] text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                >
                  सभी कथाएं देखें
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* Infinite Scroller Trigger & Status                       */}
            {/* ======================================================== */}
            {hasMore ? (
              <div
                ref={observerTarget}
                className="my-8 flex flex-col items-center justify-center gap-2 text-center"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white/90 px-4 py-2 rounded-full border border-gray-200 shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 text-[#EE7314] animate-spin" />
                    <span>और कथाएँ लोड हो रही हैं...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-orange-50 border border-gray-300 hover:border-[#EE7314] text-xs font-bold text-gray-800 hover:text-[#EE7314] shadow-xs active:scale-95 transition-all"
                  >
                    और कथाएँ देखें ({filteredBooks.length - visibleBooks.length} शेष) ➔
                  </button>
                )}
              </div>
            ) : (
              visibleBooks.length > 0 && (
                <div className="text-center my-8 text-xs text-gray-600 font-medium flex items-center justify-center gap-2">
                  <span className="w-8 h-[1px] bg-gray-300" />
                  <span>सभी {filteredBooks.length} कथाएँ प्रदर्शित हैं • परस्पर उपकार</span>
                  <span className="w-8 h-[1px] bg-gray-300" />
                </div>
              )
            )}

            {/* Dynamic API Landing Sections (if any additional sections are configured on the live server) */}
            {landingSections.length > 0 && selectedCategory === 'all' && searchQuery === '' && (
              <div className="mt-10 pt-6 border-t border-gray-300/80">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#EE7314]" />
                  <h3 className="text-base font-bold text-gray-800">
                    सर्वर से लाइव संकलन (Featured Server Collections)
                  </h3>
                </div>

                <div className="space-y-6">
                  {landingSections.map((section) => {
                    const sectionBooks: Book[] = section.blogs.map((b) =>
                      mapApiBlogToBook(b, section.name)
                    );

                    if (sectionBooks.length === 0) return null;

                    return (
                      <div
                        key={section._id}
                        className="bg-white/95 rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                          <div>
                            <h4 className="font-bold text-sm sm:text-base text-gray-800">
                              {section.name}
                            </h4>
                            {section.description && (
                              <p className="text-xs text-gray-600">{section.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-[#EE7314] font-semibold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                            {sectionBooks.length} कथाएं
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {sectionBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

