const hostname = window.location.hostname;

const isLocal =
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname.startsWith('192.168.');

export const BASE_URL = isLocal
  ? 'http://localhost:5000'
  : 'http://72.61.169.226:5000';