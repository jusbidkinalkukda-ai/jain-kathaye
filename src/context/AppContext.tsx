import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  FontSize,
  ReaderLanguage,
  NavTab,
  Book,
  Category,
  ApiLandingSection,
} from '../types';
import { getLandingPage, mapApiBlogToBook, mapApiCategoryToCategory } from '../api';
import {
  loginUser,
  sendOtp,
  signupWithOtp,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  decodeJwtPayload,
} from '../api/authService';
import { getWishlist, addToWishlist } from '../api/wishlistService';

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

  // Data & API State
  allBooks: Book[];
  allCategories: Category[];
  landingSections: ApiLandingSection[];
  isLoadingLanding: boolean;
  landingError: string | null;
  refreshLanding: () => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  
  // Auth
  user: UserProfile;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string, name?: string) => Promise<void>;
  sendSignupOtp: (name: string, email: string, password: string) => Promise<void>;
  completeSignup: (email: string, otp: string, password: string, name?: string) => Promise<void>;
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
  favorites: [],
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
    return [];
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

  // Data & API state - Only live API data, no static books
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [landingSections, setLandingSections] = useState<ApiLandingSection[]>([]);
  const [isLoadingLanding, setIsLoadingLanding] = useState<boolean>(true);
  const [landingError, setLandingError] = useState<string | null>(null);

  const refreshLanding = useCallback(async () => {
    setIsLoadingLanding(true);
    setLandingError(null);
    try {
      const res = await getLandingPage({ limit: 10, page: 0 });
      if (res && res.success && res.data) {
        setLandingSections(res.data.landing || []);

        // Extract blogs from landing sections and convert to Book models
        const apiBooks: Book[] = [];
        (res.data.landing || []).forEach((section) => {
          (section.blogs || []).forEach((blog) => {
            apiBooks.push(mapApiBlogToBook(blog, section.name));
          });
        });

        // Set exclusively API books
        setAllBooks(apiBooks);

        // Map exclusively API categories
        if (res.data.category && res.data.category.length > 0) {
          const mappedCategories: Category[] = res.data.category.map((c) => {
            const matchingLanding = (res.data.landing || []).find((l) => l._id === c._id);
            const count = matchingLanding ? (matchingLanding.blog_count ?? matchingLanding.blogs?.length ?? 0) : 0;
            return mapApiCategoryToCategory(c, count);
          });

          const allCat: Category = {
            id: 'all',
            name: 'सभी श्रेणियाँ',
            nameEn: 'All Categories',
            icon: 'Library',
            bookCount: apiBooks.length,
          };
          setAllCategories([allCat, ...mappedCategories]);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch landing data in AppContext:', err);
      setLandingError(
        err?.friendlyMessage ||
          err?.message ||
          'सर्वर से कथाएँ लोड करने में समस्या आई है।'
      );
    } finally {
      setIsLoadingLanding(false);
    }
  }, []);

  useEffect(() => {
    refreshLanding();
  }, [refreshLanding]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(DEFAULT_USER);
      clearAuthToken();
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const syncWishlist = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const ids = await getWishlist();
      if (ids.length > 0) {
        setFavorites(ids);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  }, []);

  useEffect(() => {
    if (!user.isGuest && getAuthToken()) {
      syncWishlist();
    }
  }, [user.isGuest, syncWishlist]);

  const getBookById = useCallback(
    (id: string): Book | undefined => {
      return allBooks.find((b) => b.id === id);
    },
    [allBooks]
  );

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

  const applyAuthSession = useCallback(
    async (token: string, email: string, name: string) => {
      setAuthToken(token);
      const payload = decodeJwtPayload(token);
      const newUser: UserProfile = {
        id: payload?.id || 'usr-' + Date.now(),
        name,
        identifier: email,
        isGuest: false,
        favorites,
        bookmarks,
        history: user.history,
        points: 250,
      };
      setUser(newUser);
      setAuthModalOpen(false);
      try {
        const ids = await getWishlist();
        if (ids.length > 0) {
          setFavorites(ids);
        }
      } catch (err) {
        console.error('Failed to load wishlist after login:', err);
      }
    },
    [favorites, bookmarks, user.history]
  );

  const login = async (email: string, password: string, name = 'स्वाध्यायी पाठक') => {
    const res = await loginUser({ email, password });
    await applyAuthSession(res.data!.token, email, name);
  };

  const sendSignupOtp = async (name: string, email: string, password: string) => {
    await sendOtp({ name, email, password });
  };

  const completeSignup = async (
    email: string,
    otp: string,
    password: string,
    name = 'स्वाध्यायी पाठक'
  ) => {
    const signupRes = await signupWithOtp({ email, otp });
    const token = signupRes.data?.token;
    if (token) {
      await applyAuthSession(token, email, name);
      return;
    }
    await login(email, password, name);
  };

  const continueAsGuest = () => {
    clearAuthToken();
    setUser({
      ...DEFAULT_USER,
      id: 'guest-' + Date.now(),
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    clearAuthToken();
    setUser(DEFAULT_USER);
  };

  const toggleFavorite = (bookId: string) => {
    const token = getAuthToken();
    if (user.isGuest || !token) {
      if (user.isGuest) {
        setAuthModalOpen(true);
        return;
      }
      setFavorites((prev) => {
        if (prev.includes(bookId)) {
          return prev.filter((id) => id !== bookId);
        }
        return [...prev, bookId];
      });
      return;
    }

    if (favorites.includes(bookId)) {
      setFavorites((prev) => prev.filter((id) => id !== bookId));
      return;
    }

    setFavorites((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]));
    addToWishlist(bookId).catch((err) => {
      console.error('Failed to add wishlist:', err);
      setFavorites((prev) => prev.filter((id) => id !== bookId));
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
        allBooks,
        allCategories,
        landingSections,
        isLoadingLanding,
        landingError,
        refreshLanding,
        getBookById,
        user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        sendSignupOtp,
        completeSignup,
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
