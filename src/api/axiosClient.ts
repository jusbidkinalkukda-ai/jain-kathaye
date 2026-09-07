import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL configured from environment variable or default local server
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.237:3000';

const AUTH_SKIP_URLS = [
  '/api/public/send-otp',
  '/api/public/signup',
  '/api/user/login',
];

/**
 * Pre-configured Axios instance for Jain Kathayein API
 */
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * ============================================================================
 * REQUEST INTERCEPTOR
 * ============================================================================
 * - Injects Bearer token from localStorage (if logged in)
 * - Attaches custom tracking headers and timestamps
 * - Logs request details in development
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Retrieve authentication token if present
    const token =
      localStorage.getItem('jain_auth_token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('token');

    const requestUrl = config.url || '';
    const skipAuth = AUTH_SKIP_URLS.some((path) => requestUrl.includes(path));

    if (token && config.headers && !skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Add client timestamp header for request profiling
    config.headers['X-Request-Timestamp'] = new Date().toISOString();

    // 3. Development logging
    if (import.meta.env.DEV) {
      console.log(
        `%c🚀 [Axios Request] [${config.method?.toUpperCase()}] ${config.baseURL || ''}${config.url}`,
        'color: #0284c7; font-weight: bold;',
        {
          params: config.params,
          headers: config.headers,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('❌ [Axios Request Error]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * ============================================================================
 * RESPONSE INTERCEPTOR
 * ============================================================================
 * - Logs successful responses in development
 * - Handles standardized API errors (401, 403, 404, 500, Network errors)
 * - Augments errors with user-friendly messages
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(
        `%c✅ [Axios Response] [${response.status} ${response.statusText}] ${response.config.url}`,
        'color: #16a34a; font-weight: bold;',
        response.data
      );
    }
    return response;
  },
  (error: AxiosError) => {
    let friendlyMessage = 'सर्वर से संपर्क करने में समस्या आई है। कृपया पुनः प्रयास करें।';

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data as { message?: string; error?: string };
      const apiMessage = responseData?.error || responseData?.message;
      const requestUrl = error.config?.url || '';
      const isAuthRequest = AUTH_SKIP_URLS.some((path) => requestUrl.includes(path));

      if (import.meta.env.DEV) {
        console.error(
          `%c❌ [Axios Response Error ${status}] ${error.config?.url}`,
          'color: #dc2626; font-weight: bold;',
          responseData || error.message
        );
      }

      switch (status) {
        case 401:
          friendlyMessage = apiMessage || 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।';
          if (!isAuthRequest) {
            localStorage.removeItem('jain_auth_token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
          break;
        case 403:
          friendlyMessage = apiMessage || 'आपको इस सामग्री को देखने की अनुमति नहीं है। (403 Forbidden)';
          break;
        case 404:
          friendlyMessage = apiMessage || 'अनुरोधित सामग्री उपलब्ध नहीं है। (404 Not Found)';
          break;
        case 409:
          friendlyMessage = apiMessage || 'यह ईमेल पहले से पंजीकृत है।';
          break;
        case 500:
        case 502:
        case 503:
          friendlyMessage = apiMessage || 'सर्वर पर कोई त्रुटि हुई है। कृपया थोड़ी देर बाद पुनः प्रयास करें। (500 Server Error)';
          break;
        default:
          friendlyMessage = apiMessage || `त्रुटि कोड: ${status}`;
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      friendlyMessage = 'अनुरोध समय समाप्त हो गया (Timeout)। कृपया इंटरनेट कनेक्शन जांचें।';
    } else if (error.message === 'Network Error') {
      friendlyMessage = `सर्वर (${API_BASE_URL}) से कनेक्ट नहीं हो सका। कृपया जांचें कि बैकएंड सर्वर सक्रिय है।`;
    }

    // Attach user-friendly Hindi message to error object
    (error as AxiosError & { friendlyMessage?: string }).friendlyMessage = friendlyMessage;

    return Promise.reject(error);
  }
);

export default axiosClient;
