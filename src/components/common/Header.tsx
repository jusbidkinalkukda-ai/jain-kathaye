import { Search, Heart, User, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SwastikOmBadge } from './SpiritualSymbols';
import { NavkarMarquee } from './NavkarMarquee';

export const Header: React.FC = () => {
  const {
    favorites,
    searchQuery,
    setSearchQuery,
    user,
    setAuthModalOpen,
    currentTab,
    setCurrentTab,
    setQuizOpen,
    closeReader,
    selectedBookId,
  } = useApp();

  const handleLogoClick = () => {
    closeReader();
    setCurrentTab('home');
  };

  return (
    <header className="w-full text-white">
      {/* Main Maroon Curved Container */}
      <div className="jain-arch-header pt-3 pb-5 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar: Brand, Badge, Desktop Nav & Icons */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo and Brand Title */}
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
            >
              <SwastikOmBadge size="md" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-jain-yellow-soft transition-colors">
                    जैन कथाएं
                  </h1>
                  <span className="bg-[#E78B11] text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    जैन वाचनालय
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-100/90 font-medium">
                  Jain Kathaye • शाश्वत ज्ञान व ग्रन्थावली
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => { closeReader(); setCurrentTab('home'); }}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'home' && !selectedBookId
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-amber-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                होम (Home)
              </button>
              <button
                onClick={() => { closeReader(); setCurrentTab('explore'); }}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'explore'
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-amber-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                ग्रन्थावली (Library)
              </button>
              <button
                onClick={() => setQuizOpen(true)}
                className="px-3 py-1.5 rounded-xl text-sm font-medium text-amber-100 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-jain-gold" />
                <span>पाठशाला क्विज़</span>
              </button>
            </nav>

            {/* Action Buttons: Favorites & Profile/Login */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Favorites Heart Button */}
              <button
                onClick={() => { closeReader(); setCurrentTab('explore'); }}
                className="relative w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 active:scale-95 transition-transform flex items-center justify-center border border-white/15"
                title="पसंदीदा कथाएँ"
                aria-label="पसंदीदा कथाएँ"
              >
                <Heart className="w-5 h-5 text-white fill-white/80" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-jain-maroon shadow-xs animate-pulse">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Profile / Auth Button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-full border border-white/20"
                title={user.isGuest ? "स्वाध्यायी लॉगिन करें" : user.name}
              >
                <User className="w-4 h-4 text-jain-gold" />
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {user.isGuest ? 'लॉग इन' : user.name}
                </span>
              </button>
            </div>
          </div>

          {/* Auspicious Navkar Mantra Marquee Banner */}
          <div className="mt-3.5 rounded-lg overflow-hidden">
            <NavkarMarquee />
          </div>

          {/* Search Input Bar (Matching Screenshot 1) */}
          <div className="mt-3.5">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-sky-600 sm:text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="कथा, ग्रंथ या मुनि का नाम खोजें..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-jain-text placeholder-gray-400 text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-jain-gold transition-all border border-jain-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-gray-400 hover:text-jain-maroon"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
