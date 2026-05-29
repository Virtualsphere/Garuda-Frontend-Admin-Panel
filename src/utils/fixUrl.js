/**
 * Normalizes backend media/document URLs for the admin panel.
 *
 * API routes use /api/* (proxied to backend /api/*).
 * Uploaded files are served at /public/temp/* on the backend — NOT under /api.
 */

const BACKEND_ORIGIN = 'http://72.61.169.226:5000';

const MEDIA_FILE_PATTERN = /\.(jpe?g|png|gif|webp|bmp|svg|mp4|mov|webm|pdf)$/i;

/** Inline SVG used when an image fails to load (avoids external placeholder services). */
export const IMAGE_NOT_FOUND_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='16'%3EImage not found%3C/text%3E%3C/svg%3E";

function isBareFilename(url) {
  return !url.includes('/') && MEDIA_FILE_PATTERN.test(url);
}

function toPublicPath(pathname, search = '') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path.startsWith('/public/')) return path + search;
  if (path.startsWith('/api/public/')) return path.replace('/api/public/', '/public/') + search;
  return null;
}

export function fixUrl(url) {
  if (!url || typeof url !== 'string') return url;

  // Already broken by earlier fixUrl: /api/public/* → /public/*
  if (url.startsWith('/api/public/')) {
    return url.replace('/api/public/', '/public/');
  }

  if (url.startsWith('/public/') || url.startsWith('public/')) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  if (isBareFilename(url)) {
    return `/public/temp/${encodeURIComponent(url)}`;
  }

  if (url.startsWith(BACKEND_ORIGIN)) {
    try {
      const parsed = new URL(url);
      const publicPath = toPublicPath(parsed.pathname, parsed.search);
      if (publicPath) return publicPath;
      return '/api' + parsed.pathname + parsed.search;
    } catch {
      return url;
    }
  }

  if (url.startsWith('http://') && /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    try {
      const parsed = new URL(url);
      const publicPath = toPublicPath(parsed.pathname, parsed.search);
      if (publicPath) return publicPath;
      return '/api' + parsed.pathname + parsed.search;
    } catch {
      return url;
    }
  }

  if (url.startsWith('https://') && /^https:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    try {
      const parsed = new URL(url);
      const publicPath = toPublicPath(parsed.pathname, parsed.search);
      if (publicPath) return publicPath;
      return '/api' + parsed.pathname + parsed.search;
    } catch {
      return url;
    }
  }

  return url;
}
