import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';

const ExpertPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await axios.get('/payment/expert-payments', {
                     withCredentials: true
                });
                setPayments(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching payments:", error);
                toast.error("Failed to load payments");
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const totalEarnings = payments.reduce((acc, curr) => acc + curr.amount, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600">
                    <h2 className="text-2xl font-bold text-white">Payment History</h2>
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-white text-sm uppercase font-semibold tracking-wider">Total Earnings</span>
                        <p className="text-3xl font-bold text-white">₹{totalEarnings.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-indigo-100 mt-1">(After 5% Platform Fee)</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(payment.date).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {payment.customer?.profileImage && (
                                                    <img className="h-8 w-8 rounded-full mr-3 object-cover" src={payment.customer.profileImage} alt="" />
                                                )}
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payment.customer?.name || "Unknown Customer"}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 ml-11">{payment.customer?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            {payment.paymentId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            ₹{payment.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                payment.status === 'captured' ? 'bg-green-100 text-green-800' : 
                                                payment.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium">No payments found yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpertPayments;
