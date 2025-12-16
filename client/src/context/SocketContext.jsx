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
      const socketIo = io(SOCKET_URL);
      
      setSocket(socketIo);

      socketIo.emit('setup', user);

      socketIo.on('connected', () => console.log('Socket Connected'));
      
      socketIo.on('online_users', (users) => {
          setOnlineUsers(users);
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
