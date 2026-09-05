import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls window to top (0, 0) whenever the route pathname or search params change.
 * Handles hash anchors (e.g. #nutrition, #reviews) gracefully.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If hash link exists (e.g., #ingredients), scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Scroll window to the very top instantly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Fallback for body/documentElement
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
