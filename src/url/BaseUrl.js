// In development, Vite proxy handles /api/* forwarding to the backend.
// In production, Vercel's rewrite rules handle it.
// So BASE_URL is always empty — all API calls use relative paths like /api/...
export const BASE_URL = '';