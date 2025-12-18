import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { CheckCircle, XCircle, FileText, Loader, ExternalLink } from 'lucide-react';

const AdminVerification = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // id of user currently being processed

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/admin/verifications');
            setRequests(data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch requests');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleVerification = async (userId, status) => {
        if(!window.confirm(`Are you sure you want to ${status} this expert?`)) return;
        
        setActionLoading(userId);
        try {
            await axios.put(`/admin/verifications/${userId}`, { status });
            // Refresh list
            setRequests(prev => prev.filter(req => req._id !== userId));
            alert(`User ${status} successfully`);
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Requests</h1>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded-full text-sm font-medium">
                    {requests.length} Pending
                </span>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No pending requests</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">All experts have been verified.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercas border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-6 py-4 font-medium">Expert</th>
                                    <th className="px-6 py-4 font-medium">Documents</th>
                                    <th className="px-6 py-4 font-medium">Submitted</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{req.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{req.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {req.expertProfile?.verificationDocuments?.map((doc, index) => (
                                                    <a 
                                                        key={index} 
                                                        href={doc} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                                    >
                                                        <FileText size={14} />
                                                        <span>Doc {index + 1}</span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {/* Requires adding timestamp to status change, but simplified for now */}
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {actionLoading === req._id ? (
                                                <div className="flex justify-end">
                                                    <Loader className="animate-spin text-violet-500" size={20} />
                                                </div>
                                            ) : (
                                                <div className="flex justify-end space-x-3">
                                                    <button 
                                                        onClick={() => handleVerification(req._id, 'verified')}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleVerification(req._id, 'rejected')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerification;
