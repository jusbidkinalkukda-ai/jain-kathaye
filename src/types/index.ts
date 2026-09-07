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
  rating?: number;
  readersCount?: string;
  views?: number | string;
  pageCount?: number;
  hasAudio: boolean;
  featured?: boolean;
  chapters: Chapter[];
  description: string;
  coverImage?: string;
  headerImages?: string[];
  footerImages?: string[];
  tags?: string[];
  rawContent?: string;
  isApiItem?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  bookCount: number;
  badge?: string;
  description?: string;
  apiId?: string;
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

export type NavTab = 'home' | 'explore' | 'wishlist' | 'notifications' | 'profile';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type ReaderLanguage = 'hi' | 'en';
export type ReaderTheme = 'cream' | 'white' | 'sepia' | 'dark';

// Raw API Types from /api/public/home
export interface ApiBlog {
  _id: string;
  title: string;
  header_section_img?: string[];
  footer_section_img?: string[];
  content: string;
  category: string;
  author: string;
  status: string;
  tags: string[];
  coverImage?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  views?: number | string;
  __v?: number;
}

export interface ApiLandingSection {
  _id: string;
  name: string;
  description: string;
  header_section_img?: string[];
  footer_section_img?: string[];
  blogs: ApiBlog[];
  blog_count: number;
}

export interface ApiCategory {
  _id: string;
  name: string;
}

export interface ApiLandingResponse {
  success: boolean;
  data: {
    landing: ApiLandingSection[];
    category: ApiCategory[];
  };
}
