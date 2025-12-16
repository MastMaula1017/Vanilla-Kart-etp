import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  MessageSquare, 
  Check, 
  X, 
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('/appointments');
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      setAppointments(appointments.map(app => 
         app._id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating status');
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    };

    const icons = {
      confirmed: Check,
      pending: Clock,
      cancelled: X,
      completed: Check
    };

    const Icon = icons[status] || AlertCircle;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        <Icon size={12} className="mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
           <LayoutDashboard className="text-violet-600 dark:text-violet-400" size={32} />
        </div>
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your appointments and sessions</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
             <Calendar className="mr-2 text-violet-500" size={20} />
             Your Appointments
           </h2>
           <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 py-1 px-3 rounded-full text-xs font-bold">
             {appointments.length} Total
           </span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
               <Calendar size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No appointments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Book a session with an expert to get started.</p>
            <Link to="/experts" className="mt-6 inline-block px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-all shadow-lg hover:shadow-violet-500/30">
              Find an Expert
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                  <th className="p-6">Date & Time</th>
                  <th className="p-6">With</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {appointments.map(app => {
                  const isMyAppointmentAsCustomer = app.customer?._id === user._id;
                  const counterpart = isMyAppointmentAsCustomer ? app.expert : app.customer;

                  return (
                  <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-gray-900 dark:text-white font-semibold">
                           <Calendar size={16} className="mr-2 text-violet-500" />
                           {new Date(app.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                           <Clock size={14} className="mr-2" />
                           {app.startTime} - {app.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                           {counterpart?.name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-gray-900 dark:text-white font-semibold">{counterpart?.name || 'Unknown'}</div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                             <Mail size={12} className="mr-1.5" />
                             {counterpart?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                           {/* Chat Button */}
                           <Link 
                             to={`/chat/${counterpart?._id}`}
                             className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium text-sm shadow-sm hover:shadow-md"
                           >
                             <MessageSquare size={16} className="mr-2 text-violet-500" />
                             Chat
                           </Link>

                           {/* Expert Actions */}
                           {user.roles?.includes('expert') && app.status === 'pending' && (
                             <>
                               <button 
                                 onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                 className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium text-sm shadow-md hover:shadow-green-500/30"
                               >
                                 <Check size={16} className="mr-1.5" />
                                 Accept
                               </button>
                               <button 
                                 onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                 className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-red-500 border border-red-200 dark:border-red-900/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium text-sm"
                               >
                                 <X size={16} className="mr-1.5" />
                                 Decline
                               </button>
                             </>
                           )}
                       </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
