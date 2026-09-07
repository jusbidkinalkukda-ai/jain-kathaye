import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Heart,
  Bookmark,
  LogOut,
  LogIn
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setAuthModalOpen, logout, favorites, bookmarks, openReader, allBooks } = useApp();

  const favoriteBooks = allBooks.filter((b) => favorites.includes(b.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-24 md:pb-12 text-jain-text">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#8F2018] to-[#6E1610] text-white rounded-3xl p-5 sm:p-6 shadow-jain-card mb-6 border border-white/15">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-jain-cream border-2 border-jain-gold flex items-center justify-center text-jain-maroon shadow-md shrink-0">
            <User className="w-8 h-8" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {user.name}
              </h2>
              <span className="bg-jain-gold text-jain-maroon text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                {user.isGuest ? 'अतिथि पाठक' : 'प्रमाणित स्वाध्यायी'}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 mt-0.5">
              {user.identifier === 'guest' ? 'अतिथि मोड में वाचनालय का उपयोग' : user.identifier}
            </p>
          </div>

          <div>
            {user.isGuest ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-jain-cream text-jain-maroon text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>लॉग इन करें</span>
              </button>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉग आउट</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-white/15 text-center">
          <div className="bg-black/20 rounded-2xl p-2 sm:p-3 border border-white/10">
            <div className="text-lg sm:text-xl font-extrabold text-jain-gold">
              {favorites.length}
            </div>
            <div className="text-[10px] sm:text-xs text-amber-100 font-medium mt-0.5">
              पसंदीदा ग्रंथ
            </div>
          </div>
          <div className="bg-black/20 rounded-2xl p-2 sm:p-3 border border-white/10">
            <div className="text-lg sm:text-xl font-extrabold text-white">
              {user.history.length || 2}
            </div>
            <div className="text-[10px] sm:text-xs text-amber-100 font-medium mt-0.5">
              पठित अध्याय
            </div>
          </div>
          <div className="bg-black/20 rounded-2xl p-2 sm:p-3 border border-white/10">
            <div className="text-lg sm:text-xl font-extrabold text-emerald-300">
              {user.points} 🌟
            </div>
            <div className="text-[10px] sm:text-xs text-amber-100 font-medium mt-0.5">
              धर्म संस्कार अंक
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks Section */}
      <div className="bg-white rounded-3xl border border-jain-border p-5 shadow-jain-card mb-6">
        <h3 className="font-bold text-sm sm:text-base text-jain-text mb-3 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-jain-maroon" />
          <span>सहेजे गए बुकमार्क्स (Bookmarks)</span>
        </h3>

        {bookmarks.length > 0 ? (
          <div className="space-y-2">
            {bookmarks.map((b, idx) => {
              const bBook = allBooks.find((x) => x.id === b.bookId);
              return (
                <div
                  key={idx}
                  onClick={() => openReader(b.bookId)}
                  className="p-3 rounded-2xl bg-jain-cream-light hover:bg-jain-cream border border-jain-border cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-jain-text">
                      {bBook?.title || 'कथा'}
                    </h4>
                    <p className="text-[11px] text-jain-muted">अध्याय {b.chapterId}</p>
                  </div>
                  <span className="text-xs text-jain-maroon font-bold">पढ़ें ➔</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-jain-muted italic py-2">
            अभी कोई बुकमार्क नहीं है। कथा पढ़ते समय बुकमार्क बटन दबाएँ।
          </p>
        )}
      </div>

      {/* Favorite Books List */}
      <div className="bg-white rounded-3xl border border-jain-border p-5 shadow-jain-card">
        <h3 className="font-bold text-sm sm:text-base text-jain-text mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-600 fill-red-600" />
          <span>पसंदीदा ग्रन्थावली ({favoriteBooks.length})</span>
        </h3>

        {favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => openReader(book.id)}
                className="p-3 rounded-2xl bg-[#FFFDF8] hover:bg-jain-cream border border-jain-border cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-jain-maroon text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {book.badgeTag.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-jain-text truncate">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-jain-muted truncate">✍️ {book.author}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-jain-muted italic py-2">
            कथाओं के ऊपर दिए दिल (♥) पर क्लिक करके पसंदीदा में जोड़ें।
          </p>
        )}
      </div>
    </div>
  );
};
