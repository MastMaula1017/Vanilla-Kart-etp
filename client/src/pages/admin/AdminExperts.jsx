import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';import { Trash2, Briefcase, Search, Star } from 'lucide-react';

const AdminExperts = () => {
  const { user: currentUser } = useAuth();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const { data } = await axios.get('/admin/experts');
      setExperts(data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expert?')) {
      try {
        await axios.delete(`/admin/users/${id}`);
        setExperts(experts.filter(expert => expert._id !== id));
      } catch (error) {
        console.error("Error deleting expert:", error);
        alert('Failed to delete expert');
      }
    }
  };

  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expert.expertProfile?.specialization && expert.expertProfile.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Experts Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search experts..."
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                <th className="p-4 font-medium">Expert</th>
                <th className="p-4 font-medium">Specialization</th>
                <th className="p-4 font-medium">Availability</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredExperts.map(expert => (
                <tr key={expert._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                            <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{expert.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{expert.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                            {expert.expertProfile?.specialization || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Rate: ₹{expert.expertProfile?.hourlyRate || 0}/hr
                        </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                        {expert.expertProfile?.availability?.length > 0 ? (
                            expert.expertProfile.availability.map((slot, idx) => (
                                <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                                    {slot.day.slice(0,3)}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs italic">No schedule set</span>
                        )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {currentUser?.roles?.includes('admin') && (
                        <button 
                            onClick={() => handleDelete(expert._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Expert"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredExperts.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No experts found matching your search.
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

export default AdminExperts;
