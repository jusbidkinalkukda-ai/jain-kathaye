import React from 'react';
import { useApp } from '../context/AppContext';
import { BOOKS, CATEGORIES } from '../data/storiesData';
import { CategoryPills } from '../components/books/CategoryPills';
import { BookSection } from '../components/books/BookSection';
import { BookCard } from '../components/books/BookCard';
import { Sparkles, GraduationCap } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { selectedCategory, searchQuery, setSelectedCategory, setQuizOpen } = useApp();

  // Filter books based on search query or selected category
  const filteredBooks = BOOKS.filter((book) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.badgeTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.chapters.some((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || book.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const tirthankaraCategory = CATEGORIES.find((c) => c.id === 'tirthankara') || CATEGORIES[1];
  const tirthankaraBooks = BOOKS.filter((b) => b.categoryId === 'tirthankara');

  const pauranikCategory = CATEGORIES.find((c) => c.id === 'pauranik') || CATEGORIES[2];
  const pauranikBooks = BOOKS.filter((b) => b.categoryId === 'pauranik');

  const pathshalaCategory = CATEGORIES.find((c) => c.id === 'pathshala') || CATEGORIES[4];
  const pathshalaBooks = BOOKS.filter((b) => b.categoryId === 'pathshala');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 pb-24 md:pb-12">
      {/* 1. Category Pills Row matching Screenshot 1 */}
      <CategoryPills />

      {/* If Search Active or Specific Category Selected, show clean grid view */}
      {searchQuery.trim() !== '' || selectedCategory !== 'all' ? (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm sm:text-base text-jain-text">
              {searchQuery ? `खोज परिणाम: "${searchQuery}"` : `${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
              <span className="text-xs font-normal text-jain-muted ml-2">
                ({filteredBooks.length} पुस्तकें उपलब्ध)
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
                कृपया अन्य शब्द या मुनि का नाम खोजें
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Default Home Feed Matching Screenshot 1 */
        <div>
          {/* Section Divider: 📚 श्रेणीबद्ध जैन ग्रन्थावली */}
          <div className="relative my-4 sm:my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-jain-border"></div>
            </div>
            <span className="relative px-4 bg-[#FFFDF8] text-xs sm:text-sm font-bold text-jain-maroon flex items-center justify-center gap-1.5 mx-auto w-fit">
              <span>📚</span>
              <span>श्रेणीबद्ध जैन ग्रन्थावली</span>
            </span>
          </div>

          {/* Category Section 1: तीर्थंकर चरित्र (Matching Screenshot 1) */}
          <BookSection
            category={tirthankaraCategory}
            books={tirthankaraBooks}
          />

          {/* Interactive Pathshala Banner Card */}
          <div className="my-6 bg-gradient-to-r from-[#FFF8EC] via-[#FFF0B8] to-[#FFF8EC] rounded-3xl p-4 sm:p-5 border border-[#E7B83D]/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#8F2018] text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6 text-jain-gold" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-jain-maroon">
                  जैन पाठशाला ज्ञान परीक्षा
                </h4>
                <p className="text-xs text-jain-text font-medium mt-0.5">
                  कथाओं से सीखें, प्रश्नों के उत्तर दें और स्वाध्याय अंक प्राप्त करें!
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuizOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-jain-maroon hover:bg-jain-maroon-dark text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-jain-gold" />
              <span>क्विज़ प्रारंभ करें</span>
            </button>
          </div>

          {/* Category Section 2: पौराणिक कथाएँ */}
          <BookSection
            category={pauranikCategory}
            books={pauranikBooks}
          />

          {/* Category Section 3: बाल संस्कार */}
          <BookSection
            category={pathshalaCategory}
            books={pathshalaBooks}
          />
        </div>
      )}
    </div>
  );
};
