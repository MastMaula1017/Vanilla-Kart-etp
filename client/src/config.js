// Centralized configuration for API and Socket URLs
// This ensures we switch automatically between localhost and production based on environment variables

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Derived URLs
// Assumes API_URL ends with /api, we strip it for the root domain (Socket & Static assets)
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');
export const BASE_URL = SOCKET_URL; 

console.log('API config loaded:', { API_URL, SOCKET_URL });

export { API_URL };
