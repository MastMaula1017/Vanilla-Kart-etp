import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import moment from 'moment';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const handleNewNotification = () => fetchNotifications();
    window.addEventListener('new_notification', handleNewNotification);

    // Poll every minute as a fallback
    const interval = setInterval(fetchNotifications, 60000);
    return () => {
        clearInterval(interval);
        window.removeEventListener('new_notification', handleNewNotification);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllRead = async () => {
      try {
          await axios.put('/notifications/read-all');
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          setUnreadCount(0);
      } catch (error) {
          console.error(error);
      }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                    Mark all read
                </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!notification.isRead ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                        <Link 
                            to={notification.link || '#'} 
                            onClick={() => {
                                setIsOpen(false);
                                if(!notification.isRead) handleMarkAsRead(notification._id);
                            }}
                            className="flex-1"
                        >
                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                                {notification.message}
                            </p>
                            <span className="text-xs text-gray-400">
                                {moment(notification.createdAt).fromNow()}
                            </span>
                        </Link>
                        {!notification.isRead && (
                            <button 
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="text-violet-400 hover:text-violet-600"
                                title="Mark as read"
                            >
                                <Check size={14} />
                            </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
