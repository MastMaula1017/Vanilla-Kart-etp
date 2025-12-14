import { useEffect, useState } from 'react';
import { Users, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import axios from '../../utils/axios'; // Ensure you have an axios instance set up
import SpotlightCard from '../../components/SpotlightCard';

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
    <SpotlightCard className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm" spotlightColor={color}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color.replace('0.2', '0.1').replace('rgba', 'bg')}`}> {/* Hacky color fix for demo */}
           <Icon size={24} className="text-gray-700 dark:text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
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
          color="rgba(168, 85, 247, 0.2)"
        />
        <StatCard 
          title="Active Experts" 
          value={stats.experts} 
          icon={Briefcase} 
          color="rgba(59, 130, 246, 0.2)"
        />
        <StatCard 
          title="Total Inquiries" 
          value={stats.inquiries} 
          icon={MessageSquare} 
          color="rgba(249, 115, 22, 0.2)"
          subtext={`${stats.pendingInquiries} Pending`}
        />
        <StatCard 
          title="Total Appointments" 
          value={stats.appointments} 
          icon={Calendar} 
          color="rgba(16, 185, 129, 0.2)"
        />
      </div>

      {/* Placeholder for Recent Activity Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
        <div className="flex items-center space-x-2 text-green-500">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
           <span className="font-medium">All Systems Operational</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
