import { useEffect, useState } from 'react';
import { Users, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import axios from '../../utils/axios'; // Ensure you have an axios instance set up
import SpotlightCard from '../../components/SpotlightCard';
import ActivityGraph from '../../components/ActivityGraph';
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    experts: 0,
    inquiries: 0,
    pendingInquiries: 0,
    appointments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/admin/stats'); // Uses the backend we just made
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <SpotlightCard className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300" spotlightColor={color}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600">
           <Icon size={28} className="text-gray-900 dark:text-gray-100" style={{ color: color }} />
        </div>
        <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">{title}</h3>
        {subtext && <p className="text-xs font-medium text-violet-500 mt-1">{subtext}</p>}
      </div>
    </SpotlightCard>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.users} 
          icon={Users} 
          color="#a855f7" // Violet
        />
        <StatCard 
          title="Active Experts" 
          value={stats.experts} 
          icon={Briefcase} 
          color="#3b82f6" // Blue
        />
        <StatCard 
          title="Total Inquiries" 
          value={stats.inquiries} 
          icon={MessageSquare} 
          color="#f97316" // Orange
          subtext={`${stats.pendingInquiries} Pending`}
        />
        <StatCard 
          title="Total Appointments" 
          value={stats.appointments} 
          icon={Calendar} 
          color="#10b981" // Emerald
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Activity</h2>
        <div className="h-80 w-full">
            <ActivityGraph />
        </div>
      </div>

      {/* Quick Status / Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
        <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Systems Operational</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium">Database Connected</span>
            </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
