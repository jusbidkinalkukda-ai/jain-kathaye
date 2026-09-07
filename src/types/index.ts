export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn?: string;
  content: string[];
  contentEn?: string[];
  moral: string;
  moralEn?: string;
  audioText: string;
  readingTimeMinutes: number;
}

export type CoverTheme = 'maroon' | 'green' | 'gold' | 'ochre';
export type SpiritualSymbolType = 'lotus' | 'snake' | 'bull' | 'conch' | 'lion' | 'scroll' | 'om-swastik';

export interface Book {
  id: string;
  slug: string;
  categoryId: string;
  badgeTag: string; // e.g. "अमर कथा", "क्षमा गाथा"
  title: string;
  titleEn: string;
  author: string;
  coverTheme: CoverTheme;
  symbol: SpiritualSymbolType;
  rating: number;
  readersCount: string;
  pageCount: number;
  hasAudio: boolean;
  featured?: boolean;
  chapters: Chapter[];
  description: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  bookCount: number;
  badge?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  identifier: string;
  isGuest: boolean;
  favorites: string[]; // book ids
  bookmarks: { bookId: string; chapterId: string; timestamp: string }[];
  history: { bookId: string; chapterNumber: number; date: string }[];
  points: number;
}

export type NavTab = 'home' | 'explore' | 'notifications' | 'profile';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type ReaderLanguage = 'hi' | 'en';
export type ReaderTheme = 'cream' | 'white' | 'sepia' | 'dark';
