import React from 'react';
import { Home, Compass, Bell, User, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, closeReader } = useApp();

  const handleTabSelect = (tab: NavTab) => {
    closeReader();
    setCurrentTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-jain-border shadow-lg px-3 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabSelect('home')}
          className="flex flex-col items-center justify-center p-1 relative transition-transform active:scale-95"
        >
          <div
            className={`w-11 h-8 rounded-xl flex items-center justify-center transition-colors ${
              currentTab === 'home' ? 'bg-[#FFF0B8] text-jain-maroon shadow-xs' : 'text-jain-muted'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 ${
              currentTab === 'home' ? 'text-jain-maroon' : 'text-jain-muted'
            }`}
          >
            होम
          </span>
        </button>

        {/* Tab 2: Explore */}
        <button
          onClick={() => handleTabSelect('explore')}
          className="flex flex-col items-center justify-center p-1 relative transition-transform active:scale-95"
        >
          <div
            className={`w-11 h-8 rounded-xl flex items-center justify-center transition-colors ${
              currentTab === 'explore' ? 'bg-[#FFF0B8] text-jain-maroon shadow-xs' : 'text-jain-muted'
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 ${
              currentTab === 'explore' ? 'text-jain-maroon' : 'text-jain-muted'
            }`}
          >
            अन्वेषण
          </span>
        </button>

        {/* Tab 3: Wishlist */}
        <button
          onClick={() => handleTabSelect('wishlist')}
          className="flex flex-col items-center justify-center p-1 relative transition-transform active:scale-95"
        >
          <div
            className={`w-11 h-8 rounded-xl flex items-center justify-center transition-colors ${
              currentTab === 'wishlist' ? 'bg-[#FFF0B8] text-jain-maroon shadow-xs' : 'text-jain-muted'
            }`}
          >
            <Heart className="w-5 h-5" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 ${
              currentTab === 'wishlist' ? 'text-jain-maroon' : 'text-jain-muted'
            }`}
          >
            विशलिस्ट
          </span>
        </button>

        {/* Tab 4: Notifications */}
        <button
          onClick={() => handleTabSelect('notifications')}
          className="flex flex-col items-center justify-center p-1 relative transition-transform active:scale-95"
        >
          <div
            className={`w-11 h-8 rounded-xl flex items-center justify-center transition-colors relative ${
              currentTab === 'notifications' ? 'bg-[#FFF0B8] text-jain-maroon shadow-xs' : 'text-jain-muted'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              2
            </span>
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 ${
              currentTab === 'notifications' ? 'text-jain-maroon' : 'text-jain-muted'
            }`}
          >
            सूचनाएं
          </span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => handleTabSelect('profile')}
          className="flex flex-col items-center justify-center p-1 relative transition-transform active:scale-95"
        >
          <div
            className={`w-11 h-8 rounded-xl flex items-center justify-center transition-colors ${
              currentTab === 'profile' ? 'bg-[#FFF0B8] text-jain-maroon shadow-xs' : 'text-jain-muted'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 ${
              currentTab === 'profile' ? 'text-jain-maroon' : 'text-jain-muted'
            }`}
          >
            प्रोफाइल
          </span>
        </button>
      </div>
    </nav>
  );
};
