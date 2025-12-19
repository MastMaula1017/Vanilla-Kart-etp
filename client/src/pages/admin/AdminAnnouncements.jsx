import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { 
  Bell, 
  Trash2, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ShieldAlert 
} from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/announcements/admin');
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/announcements', {
        title,
        message,
        type,
        targetAudience
      });
      setAnnouncements([data, ...announcements]);
      setTitle('');
      setMessage('');
      setNotification({ type: 'success', message: 'Announcement posted successfully' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
       setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to post announcement' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));
      setNotification({ type: 'success', message: 'Announcement deleted' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete announcement' });
    }
  };

  const getTypeIcon = (type) => {
      switch(type) {
          case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
          case 'success': return <CheckCircle className="text-green-500" size={20} />;
          case 'critical': return <ShieldAlert className="text-red-500" size={20} />;
          default: return <Info className="text-blue-500" size={20} />;
      }
  };

  const getAudienceLabel = (aud) => {
      switch(aud) {
          case 'reader': return 'All Users';
          case 'expert': return 'Experts Only';
          case 'customer': return 'Customers Only';
          default: return 'Everyone';
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
           <Bell className="text-indigo-500" /> Announcements
        </h1>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                          <input 
                              type="text" 
                              required
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="e.g. System Maintenance"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                          <textarea 
                              required
                              rows="4"
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type your announcement here..."
                          ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                              <select 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                                  value={type}
                                  onChange={(e) => setType(e.target.value)}
                              >
                                  <option value="info">Info</option>
                                  <option value="success">Success</option>
                                  <option value="warning">Warning</option>
                                  <option value="critical">Critical</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Audience</label>
                              <select 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                                  value={targetAudience}
                                  onChange={(e) => setTargetAudience(e.target.value)}
                              >
                                  <option value="all">Everyone</option>
                                  <option value="expert">Experts Only</option>
                                  <option value="customer">Customers Only</option>
                              </select>
                          </div>
                      </div>

                      <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                          {submitting ? 'Posting...' : <><Send size={18} /> Post Announcement</>}
                      </button>
                  </form>
              </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Announcements</h2>
              {loading ? (
                  <p className="text-gray-500">Loading...</p>
              ) : announcements.length === 0 ? (
                  <p className="text-gray-500">No announcements yet.</p>
              ) : (
                  announcements.map(ann => (
                      <div key={ann._id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative group">
                          <button 
                              onClick={() => handleDelete(ann._id)}
                              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete Announcement"
                          >
                              <Trash2 size={18} />
                          </button>
                          
                          <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${
                                  ann.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                  ann.type === 'success' ? 'bg-green-100 text-green-600' :
                                  ann.type === 'critical' ? 'bg-red-100 text-red-600' :
                                  'bg-blue-100 text-blue-600'
                              }`}>
                                  {getTypeIcon(ann.type)}
                              </div>
                              <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ann.title}</h3>
                                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-md">
                                          {getAudienceLabel(ann.targetAudience)}
                                      </span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                                      {ann.message}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                      <span>Posted by {ann.createdBy?.name || 'Admin'}</span>
                                      <span>•</span>
                                      <span>{new Date(ann.createdAt).toLocaleDateString()} {new Date(ann.createdAt).toLocaleTimeString()}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
