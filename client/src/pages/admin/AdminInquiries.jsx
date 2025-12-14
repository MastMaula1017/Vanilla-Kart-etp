import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { CheckCircle, AlertCircle, Search, Mail, MessageSquare, Send, X } from 'lucide-react';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // ID of inquiry being replied to
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await axios.get('/admin/inquiries');
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      const { data } = await axios.put(`/admin/inquiries/${id}`, { status: newStatus });
      setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: data.status } : inq));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) return;
    
    setSendingReply(true);
    try {
      const { data } = await axios.post(`/admin/inquiries/${id}/reply`, { reply: replyText });
      
      // Update local state
      setInquiries(inquiries.map(inq => 
        inq._id === id ? { ...inq, status: 'replied', adminReply: replyText, repliedAt: new Date() } : inq
      ));
      
      setReplyingTo(null);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error("Error sending reply:", error);
      alert('Failed to send reply. Please check server logs.');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search inquiries..."
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredInquiries.map(inq => (
          <div key={inq._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                      <MessageSquare size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{inq.subject}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <span>{inq.name}</span>
                        <span>•</span>
                        <span>{inq.email}</span>
                        <span>•</span>
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        if (replyingTo === inq._id) {
                          setReplyingTo(null);
                        } else {
                          setReplyingTo(inq._id);
                          setReplyText('');
                        }
                      }}
                      className="flex items-center px-3 py-1 bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 rounded-full text-xs font-semibold uppercase hover:bg-violet-100 transition-colors"
                    >
                      <Mail size={14} className="mr-1" />
                      {inq.status === 'replied' ? 'Replied' : 'Reply'}
                    </button>
                    
                    <button 
                      onClick={() => handleStatusUpdate(inq._id, inq.status)}
                      className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase transition-colors ${
                        inq.status === 'resolved' || inq.status === 'replied'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {inq.status === 'resolved' || inq.status === 'replied' ? (
                        <><CheckCircle size={14} className="mr-1" /> {inq.status}</>
                      ) : (
                        <><AlertCircle size={14} className="mr-1" /> Pending</>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-gray-700 dark:text-gray-300">
                  {inq.message}
                </div>

                {/* Show Admin Reply if exists */}
                {inq.adminReply && (
                   <div className="bg-violet-50 dark:bg-violet-900/10 p-4 rounded-xl border border-violet-100 dark:border-violet-900/20 ml-8">
                      <div className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-1">
                        Admin Reply • {new Date(inq.repliedAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm">
                        {inq.adminReply}
                      </div>
                   </div>
                )}
              </div>
            </div>

            {/* Reply Input Area */}
            {replyingTo === inq._id && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animation-fade-in-up">
                <textarea
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  rows="4"
                  placeholder={`Write a reply to ${inq.email}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2 space-x-2">
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleReplySubmit(inq._id)}
                    disabled={sendingReply || !replyText.trim()}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} className="mr-2" />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            No inquiries found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminInquiries;
