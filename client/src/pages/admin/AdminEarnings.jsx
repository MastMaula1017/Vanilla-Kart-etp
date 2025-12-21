import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

const AdminEarnings = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/admin/stats');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching earnings:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Earnings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Stats Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <DollarSign size={24} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">Lifetime</span>
                    </div>
                    <p className="text-indigo-100 text-sm font-medium mb-1">Total Platform Fees Collected</p>
                    <h2 className="text-4xl font-bold">₹{stats?.totalEarnings?.toLocaleString('en-IN') || 0}</h2>
                    <p className="text-xs text-indigo-200 mt-2 opacity-80">5% commission on all appointments</p>
                </div>

                 {/* Placeholder for future Monthly stats if needed */}
                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                            <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Appointments</p>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.appointments || 0}</h2>
                    <p className="text-xs text-gray-400 mt-2">Completed bookings</p>
                </div>
            </div>

            {/* Note Section */}
             <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    Fee Structure
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                    The platform automatically deducts a <strong>5% service fee</strong> from every appointment payment processed via Razorpay. 
                    The remaining 95% is credited to the Expert's earnings. This dashboard tracks the total accumulated value of that 5% fee.
                </p>
            </div>
        </div>
    );
};

export default AdminEarnings;
