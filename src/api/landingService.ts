import { axiosClient } from './axiosClient';
import {
  ApiLandingResponse,
  ApiLandingSection,
  ApiBlog,
  ApiCategory,
  Book,
  Category,
} from '../types';

export interface LandingParams {
  limit?: number;
  page?: number;
}

/**
 * Fetch landing page data from GET /api/public/home?limit=10&page=0
 */
export const getLandingPage = async (
  params: LandingParams = { limit: 10, page: 0 }
): Promise<ApiLandingResponse> => {
  const response = await axiosClient.get<ApiLandingResponse>(
    '/api/public/home',
    { params }
  );
  return response.data;
};

/**
 * Format author names gracefully (e.g. replacing raw ObjectIds with friendly author label)
 */
const formatAuthorName = (author: string): string => {
  if (!author) return 'परंपरा संकलन';
  // Check if string is a 24-character hexadecimal Mongo ObjectId
  if (/^[a-fA-F0-9]{24}$/.test(author)) {
    return 'जैन ज्ञान मंडल (संपादक)';
  }
  return author;
};

/**
 * Map an ApiBlog to our application's Book model
 */
export const mapApiBlogToBook = (
  blog: ApiBlog,
  categoryName: string = 'तीर्थंकर चरित्र'
): Book => {
  // Split content into clean paragraphs
  const rawContent = blog.content || '';
  const paragraphs = rawContent
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const finalParagraphs =
    paragraphs.length > 0 ? paragraphs : [rawContent || 'कथा सामग्री उपलब्ध नहीं है।'];

  const primaryTag = blog.tags?.[0] ? `#${blog.tags[0]}` : 'पावन चरित्र';

  return {
    id: blog._id,
    slug: blog.slug || `blog-${blog._id}`,
    categoryId: blog.category,
    badgeTag: primaryTag,
    title: blog.title,
    titleEn: blog.title,
    author: formatAuthorName(blog.author),
    coverTheme: 'maroon',
    symbol: 'lotus',
    views: blog.views ?? '1.5k readers',
    readersCount:
      blog.views !== undefined && blog.views !== null
        ? typeof blog.views === 'number'
          ? `${blog.views} views`
          : `${blog.views}`
        : '1.5k readers',
    hasAudio: true,
    featured: true,
    description: finalParagraphs[0] || `${blog.title} - जैन आगम व परंपरा पर आधारित पावन कथा।`,
    coverImage: blog.coverImage,
    headerImages: blog.header_section_img || [],
    footerImages: blog.footer_section_img || [],
    tags: blog.tags || [],
    rawContent: blog.content,
    isApiItem: true,
    chapters: [
      {
        id: `ch-${blog._id}-1`,
        chapterNumber: 1,
        title: blog.title,
        titleEn: blog.title,
        summary: finalParagraphs[0]?.slice(0, 160) + '...' || blog.title,
        summaryEn: `${blog.title} - Divine inspiring life narrative and Jain ethical teachings.`,
        content: finalParagraphs,
        contentEn: finalParagraphs,
        moral: 'अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य एवं अपरिग्रह ही सम्यक जीवन और आत्मकल्याण के सच्चे मार्ग हैं।',
        moralEn: 'Non-violence, truth, non-stealing, purity, and non-possessiveness are eternal steps toward spiritual liberation.',
        audioText: finalParagraphs.join(' '),
        readingTimeMinutes: Math.max(2, Math.ceil(finalParagraphs.join(' ').length / 250)),
      },
    ],
  };
};

/**
 * Map an ApiCategory to our application's Category model
 */
export const mapApiCategoryToCategory = (
  cat: ApiCategory,
  bookCount: number = 0
): Category => {
  return {
    id: cat._id,
    name: cat.name,
    nameEn: cat.name,
    icon: 'Sparkles',
    bookCount: bookCount,
    badge: bookCount > 0 ? `${bookCount} कथाएँ` : undefined,
    apiId: cat._id,
  };
};
