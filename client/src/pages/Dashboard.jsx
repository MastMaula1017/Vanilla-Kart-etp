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
  CreditCard,
  LayoutDashboard,
  Search
} from 'lucide-react';
import OnboardingTour from '../components/OnboardingTour';
import { DashboardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

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
        toast.error('Failed to load appointments');
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
      toast.success(`Appointment ${status} successfully`);
    } catch (error) {
      console.error('Error updating status');
      toast.error('Failed to update status');
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
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        <Icon size={10} className="mr-1" />
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardSkeleton />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OnboardingTour />
      <div className="flex items-center space-x-4 mb-8" id="tour-dashboard-title">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
           <LayoutDashboard className="text-violet-600 dark:text-violet-400" size={32} />
        </div>
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your appointments and sessions</p>
        </div>
      </div>
       
       {user.roles && user.roles.includes('expert') && (
        <div className="flex justify-end mb-6">
            <Link to="/expert/payments" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <CreditCard className="mr-2" size={20} />
                View Payments
            </Link>
        </div>
       )}

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
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-violet-200 dark:bg-violet-900/40 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl">
                    <Calendar size={40} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-gray-800 shadow-lg">
                    <Search size={18} className="text-gray-400" />
                </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No appointments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                Your schedule is looking clear. Ready to accelerate your learning? Connect with an expert today.
            </p>
            
            <Link 
                to="/experts" 
                className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-violet-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:bg-violet-700 shadow-lg hover:shadow-violet-500/40"
            >
                <span className="relative z-10 flex items-center gap-2">
                    Find an Expert
                    <Search size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                  <th className="p-4 pl-6">Date & Time</th>
                  <th className="p-4">With</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {appointments.map(app => {
                  const isMyAppointmentAsCustomer = app.customer?._id === user._id;
                  const counterpart = isMyAppointmentAsCustomer ? app.expert : app.customer;

                  return (
                  <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-gray-900 dark:text-white font-bold text-sm">
                           <Calendar size={14} className="mr-2 text-violet-500" />
                           {new Date(app.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                           <Clock size={12} className="mr-1.5" />
                           {app.startTime} - {app.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                           {counterpart?.name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-3">
                          <div className="text-gray-900 dark:text-white font-bold text-sm">{counterpart?.name || 'Unknown'}</div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                             <Mail size={10} className="mr-1" />
                             {counterpart?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                       <div className="flex items-center justify-end space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                           {/* Chat Button */}
                           <Link 
                             to={`/chat/${counterpart?._id}`}
                             className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold text-xs shadow-sm"
                           >
                             <MessageSquare size={14} className="mr-1.5 text-violet-500" />
                             Chat
                           </Link>

                           {/* Expert Actions */}
                           {user.roles?.includes('expert') && app.expert?._id === user._id && app.status === 'pending' && (
                             <>
                               <button 
                                 onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                 className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-bold text-xs shadow-md"
                               >
                                 <Check size={14} className="mr-1" />
                                 Accept
                               </button>
                               <button 
                                 onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                 className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 text-red-500 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-xs"
                               >
                                 <X size={14} className="mr-1" />
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

