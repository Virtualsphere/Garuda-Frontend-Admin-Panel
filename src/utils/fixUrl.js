/**
 * Fixes mixed content issues by converting backend HTTP URLs to use
 * the Vercel proxy path instead, so images are served through HTTPS.
 *
 * Example:
 *   http://72.61.169.226:5000/uploads/photo.jpg
 *   → /api/uploads/photo.jpg  (served via Vercel proxy over HTTPS)
 */

const BACKEND_ORIGIN = 'http://72.61.169.226:5000';

export function fixUrl(url) {
  if (!url || typeof url !== 'string') return url;

  // If the URL starts with the backend origin, replace it with a relative proxy path
  if (url.startsWith(BACKEND_ORIGIN)) {
    return url.replace(BACKEND_ORIGIN, '/api').replace('/api/api/', '/api/');
  }

  // Also handle any http:// IP-based URL (in case the backend IP changes)
  if (url.startsWith('http://') && /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    try {
      const parsed = new URL(url);
      return '/api' + parsed.pathname + parsed.search;
    } catch {
      return url;
    }
  }

  return url;
}
