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
    let newNotifications = [];
    let newAnnouncements = [];
    
    // 1. Fetch Notifications
    try {
        const { data } = await axios.get('/notifications');
        newNotifications = data.notifications || [];
    } catch (error) {
        console.error('Failed to fetch notifications', error);
    }

    // 2. Fetch Announcements
    try {
        const { data } = await axios.get('/announcements');
        newAnnouncements = data || [];
    } catch (error) {
        console.error('Failed to fetch announcements', error);
    }

    // 3. Process Announcements
    const readAnnouncements = JSON.parse(localStorage.getItem('read_announcements') || '[]');
    
    const formattedAnnouncements = newAnnouncements.map(ann => ({
        _id: ann._id,
        message: `${ann.title}: ${ann.message}`,
        type: 'announcement', 
        announcementType: ann.type,
        createdAt: ann.createdAt,
        isRead: readAnnouncements.includes(ann._id),
        link: '#' 
    }));

    // 4. Merge and Sort
    const combined = [...newNotifications, ...formattedAnnouncements].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    setNotifications(combined);
    
    const unreadNotifs = newNotifications.filter(n => !n.isRead).length;
    const unreadAnnounce = formattedAnnouncements.filter(a => !a.isRead).length;
    setUnreadCount(unreadNotifs + unreadAnnounce);
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

  const handleMarkAsRead = async (id, type) => {
    if (type === 'announcement') {
        const readAnnouncements = JSON.parse(localStorage.getItem('read_announcements') || '[]');
        if (!readAnnouncements.includes(id)) {
            const updated = [...readAnnouncements, id];
            localStorage.setItem('read_announcements', JSON.stringify(updated));
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    } else {
        try {
            await axios.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    }
  };

  const markAllRead = async () => {
      try {
          // Mark server notifications
          await axios.put('/notifications/read-all');
          
          // Mark local announcements
          const allAnnouncements = notifications
              .filter(n => n.type === 'announcement')
              .map(n => n._id);
          
          const existingRead = JSON.parse(localStorage.getItem('read_announcements') || '[]');
          const newRead = [...new Set([...existingRead, ...allAnnouncements])];
          localStorage.setItem('read_announcements', JSON.stringify(newRead));

          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          setUnreadCount(0);
      } catch (error) {
          console.error(error);
      }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
            fetchNotifications();
            setIsOpen(!isOpen);
        }}
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
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                        !notification.isRead 
                            ? notification.type === 'announcement'
                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                : 'bg-violet-50/50 dark:bg-violet-900/10' 
                            : ''
                    } ${notification.type === 'announcement' ? 'border-l-4 border-blue-500 pl-3' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                        <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                                // Only close if it's a link or just marking as read
                                if(!notification.isRead) handleMarkAsRead(notification._id, notification.type);
                                if(notification.link !== '#') {
                                    setIsOpen(false);
                                    // Navigate if needed, but Link component handles it usually. 
                                    // Since we changed Link to div for click handling, we might need manual navigate or use Link wrapping content.
                                }
                            }}
                        >
                             {notification.type === 'announcement' && (
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mb-1 inline-block ${
                                    notification.announcementType === 'critical' ? 'bg-red-100 text-red-600' :
                                    notification.announcementType === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    Announcement
                                </span>
                             )}
                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                                {notification.message}
                            </p>
                            <span className="text-xs text-gray-400">
                                {moment(notification.createdAt).fromNow()}
                            </span>
                        </div>
                        {!notification.isRead && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification._id, notification.type);
                                }}
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
