import { axiosClient } from './axiosClient';
import { ApiEnvelope } from './authService';

const extractId = (item: unknown): string | null => {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') return null;
  const rec = item as Record<string, unknown>;
  if (typeof rec.blog === 'string') return rec.blog;
  if (rec.blog && typeof rec.blog === 'object') {
    const blog = rec.blog as Record<string, unknown>;
    if (typeof blog._id === 'string') return blog._id;
    if (typeof blog.id === 'string') return blog.id;
  }
  if (typeof rec.blogId === 'string') return rec.blogId;
  if (typeof rec.blog_id === 'string') return rec.blog_id;
  if (typeof rec._id === 'string') return rec._id;
  if (typeof rec.id === 'string') return rec.id;
  return null;
};

const pickWishlistList = (payload: unknown): unknown[] => {
  if (!payload || typeof payload !== 'object') return [];
  const root = payload as Record<string, unknown>;
  const data = (root.data ?? root) as unknown;

  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const rec = data as Record<string, unknown>;
  const nestedKeys = ['wishlist', 'Wishlist', 'wishList', 'wishlists', 'items'];
  for (const key of nestedKeys) {
    if (Array.isArray(rec[key])) return rec[key] as unknown[];
  }
  return [];
};

export const extractWishlistIds = (payload: unknown): string[] => {
  const ids = pickWishlistList(payload)
    .map(extractId)
    .filter((id): id is string => Boolean(id));
  return [...new Set(ids)];
};

/** GET /api/public/wishlist */
export const getWishlist = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<ApiEnvelope>('/api/public/wishlist');
  return extractWishlistIds(data);
};

/** POST /api/public/Wishlist/:id */
export const addToWishlist = async (bookId: string): Promise<ApiEnvelope> => {
  const { data } = await axiosClient.post<ApiEnvelope>(
    `/api/public/Wishlist/${bookId}`
  );
  if (data && data.success === false) {
    throw new Error(data.error || data.message || 'विशलिस्ट में जोड़ने में समस्या आई');
  }
  return data;
};
