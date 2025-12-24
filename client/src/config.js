// Centralized configuration for API and Socket URLs
// This ensures we switch automatically between localhost and production based on environment variables

const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
// Android WebView often serves from file:// (empty hostname) or custom scheme. Default to Prod for those.
const API_URL = isLocal ? 'http://localhost:5000/api' : 'https://consultpro-backend-4344983db754.herokuapp.com/api';

// Derived URLs
// Assumes API_URL ends with /api, we strip it for the root domain (Socket & Static assets)
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');
export const BASE_URL = SOCKET_URL; 


export { API_URL };
