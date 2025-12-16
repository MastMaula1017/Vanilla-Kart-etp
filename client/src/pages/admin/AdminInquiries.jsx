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
    // Debug: Check if clicked
    console.log('Clicked status update', id, currentStatus);
    
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      const { data } = await axios.put(`/admin/inquiries/${id}`, { status: newStatus });
      setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: data.status } : inq));
      alert(`Status updated to ${data.status}`); // Temporary feedback
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Failed to update status');
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and respond to customer questions</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or subject..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredInquiries.map(inq => (
          <div key={inq._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-xl">
             <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon Column */}
                  <div className="flex-shrink-0 hidden md:block">
                     <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center">
                        <MessageSquare size={24} />
                     </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                       <div>
                          <div className="flex items-center space-x-3 mb-1">
                             <h3 className="font-bold text-xl text-gray-900 dark:text-white">{inq.subject || 'Inquiry'}</h3>
                             {inq.status === 'resolved' || inq.status === 'replied' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center">
                                  <CheckCircle size={12} className="mr-1" />
                                  {inq.status.toUpperCase()}
                                </span>
                             ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 flex items-center">
                                  <AlertCircle size={12} className="mr-1" />
                                  PENDING
                                </span>
                             )}
                          </div>
                          
                          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-2">
                            <div className="flex items-center space-x-1">
                               <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                                  {inq.name.charAt(0)}
                               </div>
                               <span className="font-medium text-gray-700 dark:text-gray-200">{inq.name}</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="font-mono text-xs">{inq.email}</span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span>{new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="flex items-center space-x-3">
                         <button 
                             onClick={() => {
                               if (replyingTo === inq._id) {
                                 setReplyingTo(null);
                               } else {
                                 setReplyingTo(inq._id);
                                 setReplyText('');
                               }
                             }}
                             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                               inq.status === 'replied' 
                               ? 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600' 
                               : 'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800 dark:hover:bg-violet-900/40'
                             }`}
                         >
                            <span className="flex items-center">
                              <Mail size={16} className="mr-2" />
                              {inq.status === 'replied' ? 'Replied' : 'Reply'}
                            </span>
                         </button>

                         {/* Status Toggle (Optional feature, assuming 'resolved' toggle is desired) */}
                         <button 
                            onClick={() => handleStatusUpdate(inq._id, inq.status)}
                            title={inq.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                         >
                            {inq.status === 'resolved' || inq.status === 'replied' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} />}
                         </button>
                       </div>
                    </div>

                    {/* Message Body */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700/50">
                       {inq.message}
                    </div>

                    {/* Admin Reply Section */}
                    {inq.adminReply && (
                       <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-violet-500 before:rounded-full">
                          <div className="flex items-center space-x-2 mb-2">
                             <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                                <Send size={12} className="text-violet-600 dark:text-violet-400" />
                             </div>
                             <span className="text-sm font-bold text-violet-600 dark:text-violet-400">Admin Response</span>
                             <span className="text-xs text-gray-400">• {new Date(inq.repliedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm pl-8">
                             {inq.adminReply}
                          </div>
                       </div>
                    )}
                  </div>
                </div>
             </div>

             {/* Animated Reply Area */}
             {replyingTo === inq._id && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-6 animate-fade-in">
                   <div className="flex items-start space-x-4">
                      <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                             Reply to {inq.name}
                          </label>
                          <textarea
                             className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none resize-none shadow-sm transition-shadow min-h-[120px]"
                             placeholder={`Write your response here...`}
                             value={replyText}
                             onChange={(e) => setReplyText(e.target.value)}
                             autoFocus
                          ></textarea>
                          <div className="flex justify-between items-center mt-4">
                             <p className="text-xs text-gray-400">An email will be sent to {inq.email}.</p>
                             <div className="flex space-x-3">
                                 <button 
                                   onClick={() => setReplyingTo(null)}
                                   className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-colors"
                                 >
                                   Cancel
                                 </button>
                                 <button 
                                   onClick={() => handleReplySubmit(inq._id)}
                                   disabled={sendingReply || !replyText.trim()}
                                   className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                 >
                                   {sendingReply ? (
                                     <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Sending...</span>
                                   ) : (
                                     <span className="flex items-center"><Send size={16} className="mr-2" /> Send Reply</span>
                                   )}
                                 </button>
                             </div>
                          </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        ))}

        {filteredInquiries.length === 0 && (
           <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                 <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No inquiries found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search terms</p>
           </div>
        )}
      </div>
    </div>
  );
};


export default AdminInquiries;
