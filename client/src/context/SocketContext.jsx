import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketIo = io(SOCKET_URL, {
        transports: ['polling', 'websocket'], // Start with polling (HTTP), upgrade to WS if possible
        withCredentials: true,
        reconnectionAttempts: 5,
        timeout: 20000,
        path: '/socket.io'
      });
      
      setSocket(socketIo);

      socketIo.emit('setup', user);

      socketIo.on('connected', () => console.log('Socket Connected'));
      
      socketIo.on('online_users', (users) => {
          setOnlineUsers(users);
      });

      socketIo.on('notification', () => {
          // You might want to trigger a re-fetch in NotificationDropdown 
          // essentially this event just signals "something new"
          // Ideally, we emit this event to the specific user room
          // For simple implementation, we can use a custom event dispatch or Context
          // But since NotificationDropdown fetches on mount and poll, 
          // we can just stick to that or expose a refresh function.
          // TO keep it simple and centralized, let's dispatch a custom window event
          window.dispatchEvent(new Event('new_notification'));
      });

      return () => {
        socketIo.disconnect();
      };
    } else {
        if(socket) {
            socket.disconnect();
            setSocket(null);
            setOnlineUsers([]);
        }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
