import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FontSize, ReaderLanguage, NavTab } from '../types';

interface AudioState {
  isPlaying: boolean;
  bookId: string | null;
  chapterNumber: number | null;
  text: string;
  speed: number;
}

interface AppContextType {
  // Navigation & Views
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  selectedBookId: string | null;
  selectedChapterNumber: number;
  openReader: (bookId: string, chapterNumber?: number) => void;
  closeReader: () => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Auth
  user: UserProfile;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (identifier: string, name?: string) => void;
  continueAsGuest: () => void;
  logout: () => void;

  // Favorites & Bookmarks
  favorites: string[];
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  bookmarks: { bookId: string; chapterId: string; timestamp: string }[];
  toggleBookmark: (bookId: string, chapterId: string) => void;
  isBookmarked: (bookId: string, chapterId: string) => boolean;

  // Reader Settings
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  readerLanguage: ReaderLanguage;
  setReaderLanguage: (lang: ReaderLanguage) => void;

  // Audio Narration
  audio: AudioState;
  playAudio: (bookId: string, chapterNumber: number, text: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setAudioSpeed: (speed: number) => void;
  
  // Quiz
  isQuizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'guest-1',
  name: 'अतिथि स्वाध्यायी',
  identifier: 'guest',
  isGuest: true,
  favorites: ['mahavira-charitra', 'parshvanath-kamath'],
  bookmarks: [],
  history: [],
  points: 120,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isQuizOpen, setQuizOpen] = useState<boolean>(false);

  // User Auth State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('jain_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_USER;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('jain_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['mahavira-charitra', 'parshvanath-kamath'];
  });

  const [bookmarks, setBookmarks] = useState<{ bookId: string; chapterId: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('jain_bookmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [readerLanguage, setReaderLanguage] = useState<ReaderLanguage>('hi');

  // Audio State
  const [audio, setAudio] = useState<AudioState>({
    isPlaying: false,
    bookId: null,
    chapterNumber: null,
    text: '',
    speed: 1,
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jain_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jain_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('jain_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handle SpeechSynthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    if (!audio.isPlaying) {
      window.speechSynthesis.cancel();
      return;
    }

    if (audio.text && audio.isPlaying) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audio.text);
      utterance.rate = audio.speed;
      utterance.pitch = 1.0;

      // Try finding Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      if (hiVoice) {
        utterance.voice = hiVoice;
      }
      utterance.lang = 'hi-IN';

      utterance.onend = () => {
        setAudio(prev => ({ ...prev, isPlaying: false }));
      };

      utterance.onerror = () => {
        setAudio(prev => ({ ...prev, isPlaying: false }));
      };

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audio.isPlaying, audio.text, audio.speed]);

  const openReader = (bookId: string, chapterNumber = 1) => {
    setSelectedBookId(bookId);
    setSelectedChapterNumber(chapterNumber);
    // Add to user history
    setUser(prev => {
      const filtered = prev.history.filter(h => h.bookId !== bookId);
      return {
        ...prev,
        history: [{ bookId, chapterNumber, date: new Date().toLocaleDateString('hi-IN') }, ...filtered],
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeReader = () => {
    setSelectedBookId(null);
  };

  const login = (identifier: string, name = 'जिज्ञासु स्वाध्यायी') => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name,
      identifier,
      isGuest: false,
      favorites,
      bookmarks,
      history: user.history,
      points: 250,
    };
    setUser(newUser);
    setAuthModalOpen(false);
  };

  const continueAsGuest = () => {
    setUser({
      ...DEFAULT_USER,
      id: 'guest-' + Date.now(),
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);

  const toggleBookmark = (bookId: string, chapterId: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.bookId === bookId && b.chapterId === chapterId);
      if (exists) {
        return prev.filter(b => !(b.bookId === bookId && b.chapterId === chapterId));
      } else {
        return [...prev, { bookId, chapterId, timestamp: new Date().toISOString() }];
      }
    });
  };

  const isBookmarked = (bookId: string, chapterId: string) =>
    bookmarks.some(b => b.bookId === bookId && b.chapterId === chapterId);

  const playAudio = (bookId: string, chapterNumber: number, text: string) => {
    setAudio({
      isPlaying: true,
      bookId,
      chapterNumber,
      text,
      speed: 1,
    });
  };

  const pauseAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setAudio(prev => ({ ...prev, isPlaying: false }));
  };

  const resumeAudio = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setAudio(prev => ({ ...prev, isPlaying: true }));
    } else if (audio.text) {
      setAudio(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudio({
      isPlaying: false,
      bookId: null,
      chapterNumber: null,
      text: '',
      speed: 1,
    });
  };

  const setAudioSpeed = (speed: number) => {
    setAudio(prev => ({ ...prev, speed }));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedBookId,
        selectedChapterNumber,
        openReader,
        closeReader,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        continueAsGuest,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        fontSize,
        setFontSize,
        readerLanguage,
        setReaderLanguage,
        audio,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        setAudioSpeed,
        isQuizOpen,
        setQuizOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
