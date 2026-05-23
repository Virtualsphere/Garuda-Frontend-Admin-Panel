const isLocal =
  ['localhost', '127.0.0.1'].includes(window.location.hostname) ||
  window.location.hostname.startsWith('192.168.');

export const BASE_URL = isLocal
  ? 'http://localhost:5000' // local backend
  : ''; // in production, rely on Vercel's rewrite (/api/proxy)