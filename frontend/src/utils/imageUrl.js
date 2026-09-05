/**
 * Universal Image URL resolver for NutriHeal Bakes
 * Handles uploaded local images, production cloud backend URLs, external Unsplash URLs, and base64 strings
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutriheal-bakes.onrender.com/api';
// Remove /api suffix to get backend host URL
export const BACKEND_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80';

export const getProductImageUrl = (imagePath, fallback = DEFAULT_PRODUCT_FALLBACK) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return fallback;
  }

  // Already a full URL (http, https, data:image, blob:)
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  // Relative upload path (e.g. /uploads/products/xyz.png)
  if (imagePath.startsWith('/')) {
    return `${BACKEND_SERVER_URL}${imagePath}`;
  }

  return `${BACKEND_SERVER_URL}/${imagePath}`;
};

export default getProductImageUrl;
