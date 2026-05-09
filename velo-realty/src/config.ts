const API_BASE_URL = "https://velo-realty-backend.onrender.com";

export const IMAGEKIT_PUBLIC_KEY = 'public_p+Zs79z/CFpE8ecWc4QWKDNcWqE=';
export const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/zpj7zrcs73';

export const getOptimizedImage = (url: string, width: number = 800) => {
  if (!url) return '';
  // Check if it's already an ImageKit URL
  if (url.includes('ik.imagekit.io')) {
    // If it already has query params, append with &
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tr=w-${width},q-80,f-auto`;
  }
  return url;
};

export default API_BASE_URL;
