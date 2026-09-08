import React from 'react';
import { Search, Heart, User, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavkarMarquee } from './NavkarMarquee';

export const Header: React.FC = () => {
  const {
    favorites,
    searchQuery,
    setSearchQuery,
    user,
    setAuthModalOpen,
    setCurrentTab,
    setQuizOpen,
    closeReader,
    setSelectedCategory,
  } = useApp();

  const handleLogoClick = () => {
    closeReader();
    setSelectedCategory('all');
    setCurrentTab('home');
  };

  return (
    <header className="w-full text-white select-none">
      {/* Main maroon header banner */}
      <div className="jainkathayein-header-banner relative px-3 sm:px-6 py-3 sm:py-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-jain-gold/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-jain-gold/40 flex items-center justify-center shadow-md p-1 group-hover:scale-105 transition-transform">
                <span className="text-xl sm:text-2xl drop-shadow-sm">卐</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm font-heading">
                    Jain Kathayein
                  </h1>
                </div>
                <p className="text-[10px] sm:text-xs text-amber-100 font-medium tracking-wide">
                  जैन कथाएँ वाचनालय • शाश्वत ज्ञान • धर्म कथा
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-jain-gold">
                स्वाध्याय गंगा
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                तीर्थंकर चरित्र • आगम गाथाएँ
              </p>
            </div>

            {/* Right: Seals, Favorites & User Login */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Spiritual Seal / Since 1996 badge */}
              <div className="hidden sm:flex flex-col items-end text-right pr-2 border-r border-white/20">
                <div className="flex items-center gap-1 text-[11px] font-bold text-jain-gold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>सत्य • अहिंसा</span>
                </div>
                <span className="text-[10px] text-amber-100/90">परस्पर उपकारो जीवानाम्</span>
              </div>

              {/* Favorites Heart Button */}
              <button
                onClick={() => { closeReader(); setCurrentTab('wishlist'); }}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/20 hover:bg-black/30 active:scale-95 transition-transform flex items-center justify-center border border-white/25 shadow-xs"
                title="पसंदीदा कथाएँ (Favorites)"
                aria-label="पसंदीदा कथाएँ"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/90" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-jain-maroon-dark shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Profile / Auth Button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/30 shadow-xs"
                title={user.isGuest ? "स्वाध्यायी लॉगिन करें" : user.name}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
                <span className="hidden md:inline max-w-[100px] truncate">
                  {user.isGuest ? 'लॉग इन' : user.name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Horizontal Navigation Bar (From Screenshot) */}
      <div className="jainkathayein-subnav-bar text-xs font-medium px-3 sm:px-6 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-3 sm:gap-5 whitespace-nowrap text-white/95 text-[11px] sm:text-xs">
            <button
              onClick={() => { closeReader(); setCurrentTab('home'); }}
              className="flex items-center gap-1 text-white hover:text-jain-gold transition-colors font-bold"
            >
              <span>होम</span>
            </button>
            <button
              onClick={() => { closeReader(); setCurrentTab('explore'); }}
              className="hover:text-jain-gold transition-colors"
            >
              ग्रन्थावली (Library)
            </button>
            <button
              onClick={() => { closeReader(); setCurrentTab('wishlist'); }}
              className="hover:text-jain-gold transition-colors"
            >
              विशलिस्ट
            </button>
            <button
              onClick={() => { closeReader(); setSelectedCategory('tirthankara'); setCurrentTab('home'); }}
              className="hover:text-jain-gold transition-colors"
            >
              तीर्थंकर चरित्र
            </button>
            <button
              onClick={() => setQuizOpen(true)}
              className="hover:text-jain-gold transition-colors flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-jain-gold" />
              <span>पाठशाला क्विज़</span>
            </button>
          </nav>

          {/* Search Trigger / Quick Search Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="कथा खोजें (Search)..."
                className="w-32 sm:w-48 pl-7 pr-6 py-1 rounded-full bg-white/20 hover:bg-white/30 focus:bg-white focus:text-gray-800 text-white placeholder-white/70 text-[11px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-amber-300 border border-white/30"
              />
              <Search className="w-3.5 h-3.5 text-white/80 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/80 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Auspicious Navkar Mantra Marquee Banner */}
      <div className="bg-jain-maroon-dark text-amber-100 py-1 border-b border-jain-gold/20">
        <NavkarMarquee />
      </div>
    </header>
  );
};

