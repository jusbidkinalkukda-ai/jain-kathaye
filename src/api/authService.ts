import { AxiosError } from 'axios';
import { axiosClient } from './axiosClient';

export const AUTH_TOKEN_KEY = 'jain_auth_token';

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginData {
  token: string;
}

export const getAuthToken = (): string | null => {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('token')
  );
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
};

export const decodeJwtPayload = (
  token: string
): { id?: string; role?: string } | null => {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const padded = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const ax = error as AxiosError<{ error?: string; message?: string }> & {
    friendlyMessage?: string;
  };
  return (
    ax.response?.data?.error ||
    ax.response?.data?.message ||
    ax.friendlyMessage ||
    (error instanceof Error ? error.message : '') ||
    fallback
  );
};

/** POST /api/public/send-otp */
export const sendOtp = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiEnvelope> => {
  const { data } = await axiosClient.post<ApiEnvelope>('/api/public/send-otp', payload);
  if (!data.success) {
    throw new Error(data.error || data.message || 'OTP भेजने में समस्या आई');
  }
  return data;
};

/** POST /api/public/signup */
export const signupWithOtp = async (payload: {
  email: string;
  otp: string;
}): Promise<ApiEnvelope<{ token?: string }>> => {
  const { data } = await axiosClient.post<ApiEnvelope<{ token?: string }>>(
    '/api/public/signup',
    payload
  );
  if (!data.success) {
    throw new Error(data.error || data.message || 'साइन अप विफल रहा');
  }
  return data;
};

/** POST /api/user/login */
export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<ApiEnvelope<LoginData>> => {
  const { data } = await axiosClient.post<ApiEnvelope<LoginData>>('/api/user/login', payload);
  if (!data.success || !data.data?.token) {
    throw new Error(data.error || data.message || 'लॉग इन विफल रहा');
  }
  return data;
};
