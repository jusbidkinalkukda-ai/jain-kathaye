import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { WishlistView } from './views/WishlistView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { ReaderView } from './views/ReaderView';
import { AuthModal } from './views/AuthModal';
import { QuizModal } from './views/QuizModal';
import { FloatingAudioPlayer } from './components/audio/FloatingAudioPlayer';
import { SwastikOmBadge } from './components/common/SpiritualSymbols';

const AppContent: React.FC = () => {
  const { currentTab, selectedBookId } = useApp();

  // If reader is open, show ReaderView full screen (matching Screenshot 2)
  if (selectedBookId) {
    return (
      <div className="min-h-screen bg-[#FFFDF8]">
        <ReaderView />
        <AuthModal />
        <QuizModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <div>
        {/* Top Header matching Screenshot 1 */}
        <Header />

        {/* Dynamic Tab View */}
        <main className="w-full">
          {currentTab === 'home' && <HomeView />}
          {currentTab === 'explore' && <ExploreView />}
          {currentTab === 'wishlist' && <WishlistView />}
          {currentTab === 'notifications' && <NotificationsView />}
          {currentTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-b from-[#FFF8EC] to-[#F5EADB] border-t border-jain-border py-8 px-6 text-center text-xs text-jain-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SwastikOmBadge size="sm" />
            <div className="text-left">
              <h4 className="font-bold text-sm text-jain-maroon">
                जैन कथाएँ वाचनालय
              </h4>
              <p className="text-[11px] text-jain-muted">
                “शाश्वत ज्ञान • धर्म कथा • संस्कार संग”
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-medium text-jain-text">
              परस्पर उपकार, अहिंसा, संयम एवं स्वाध्याय का पावन डिजिटल संकलन
            </p>
            <p className="text-[10px] text-jain-muted mt-0.5">
              तीर्थंकर चरित्र • आगम गाथाएँ • पौराणिक इतिहास • बाल संस्कार
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar matching Screenshot 1 */}
      <MobileBottomNav />

      {/* Persistent Floating Audio Player when listening */}
      <FloatingAudioPlayer />

      {/* Modals */}
      <AuthModal />
      <QuizModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
