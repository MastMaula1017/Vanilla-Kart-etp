import { API_URL, SOCKET_URL } from '../config';

const DebugInfo = () => {
  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/80 text-green-400 font-mono text-xs rounded-lg z-50 pointer-events-none max-w-sm overflow-hidden">
      <p><strong>Debugging Info:</strong></p>
      <p>API_URL: {API_URL}</p>
      <p>SOCKET_URL: {SOCKET_URL}</p>
      <p>VITE_ENV: {import.meta.env.VITE_API_BASE_URL || 'undefined'}</p>
      <p>MODE: {import.meta.env.MODE}</p>
    </div>
  );
};

export default DebugInfo;
