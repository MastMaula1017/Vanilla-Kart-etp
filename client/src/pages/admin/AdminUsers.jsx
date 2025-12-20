import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Trash2, User, Search, Shield, ShieldOff, Headset, Circle, UserPlus, UserMinus } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Modal State */
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning',
    confirmText: 'Confirm'
  });

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (id) => {
    setConfirmModal({
        isOpen: true,
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Delete',
        onConfirm: async () => {
            try {
                await axios.delete(`/admin/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                closeConfirmModal();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert('Failed to delete user');
            }
        }
    });
  };

  const handleToggleAdmin = (user) => {
    const isAdmin = user.roles.includes('admin');
    const action = isAdmin ? 'Remove Admin' : 'Make Admin';
    
    setConfirmModal({
        isOpen: true,
        title: `${action} Role`,
        message: `Are you sure you want to ${action.toLowerCase()} role for ${user.name}?`,
        type: isAdmin ? 'danger' : 'warning',
        confirmText: action,
        onConfirm: async () => {
             try {
                let newRoles;
                if (isAdmin) {
                    newRoles = user.roles.filter(r => r !== 'admin');
                } else {
                    newRoles = [...user.roles, 'admin'];
                }
                
                const { data } = await axios.put(`/admin/users/${user._id}/roles`, { roles: newRoles });
                setUsers(users.map(u => u._id === user._id ? { ...u, roles: data.roles } : u));
                alert(`User ${isAdmin ? 'removed from' : 'promoted to'} admin successfully.`);
                closeConfirmModal();
            } catch (error) {
                console.error("Error updating roles:", error);
                alert("Failed to update roles.");
            }
        }
    });
  };

  const handleToggleModerator = (user) => {
    const isModerator = user.roles.includes('moderator');
    const action = isModerator ? 'Remove Moderator' : 'Make Moderator';
    
    setConfirmModal({
        isOpen: true,
        title: `${action} Role`,
        message: `Are you sure you want to ${action.toLowerCase()} role for ${user.name}?`,
        type: isModerator ? 'danger' : 'warning',
        confirmText: action,
        onConfirm: async () => {
             try {
                let newRoles;
                if (isModerator) {
                    newRoles = user.roles.filter(r => r !== 'moderator');
                } else {
                    newRoles = [...user.roles, 'moderator'];
                }
                
                const { data } = await axios.put(`/admin/users/${user._id}/roles`, { roles: newRoles });
                setUsers(users.map(u => u._id === user._id ? { ...u, roles: data.roles } : u));
                alert(`User ${isModerator ? 'removed from' : 'promoted to'} moderator successfully.`);
                closeConfirmModal();
            } catch (error) {
                console.error("Error updating roles:", error);
                alert("Failed to update roles.");
            }
        }
    });
  };

  const handleToggleSupport = (user) => {
    const isSupport = user.roles.includes('inquiry_support');
    const action = isSupport ? 'Remove Support' : 'Make Support';
    
    setConfirmModal({
        isOpen: true,
        title: `${action} Role`,
        message: `Are you sure you want to ${action.toLowerCase()} role for ${user.name}?`,
        type: isSupport ? 'danger' : 'warning',
        confirmText: action,
        onConfirm: async () => {
             try {
                let newRoles;
                if (isSupport) {
                    newRoles = user.roles.filter(r => r !== 'inquiry_support');
                } else {
                    newRoles = [...user.roles, 'inquiry_support'];
                }
                
                const { data } = await axios.put(`/admin/users/${user._id}/roles`, { roles: newRoles });
                setUsers(users.map(u => u._id === user._id ? { ...u, roles: data.roles } : u));
                alert(`User ${isSupport ? 'removed from' : 'assigned to'} Inquiry Support successfully.`);
                closeConfirmModal();
            } catch (error) {
                console.error("Error updating roles:", error);
                alert("Failed to update roles.");
            }
        }
    });
  };

  const handleToggleExpert = (user) => {
    const isExpert = user.roles.includes('expert');
    const action = isExpert ? 'Revoke Expert' : 'Make Expert';
    
    setConfirmModal({
        isOpen: true,
        title: `${action} Role`,
        message: `Are you sure you want to ${action.toLowerCase()} role for ${user.name}?${!isExpert ? ' They will appear in the Experts list.' : ''}`,
        type: isExpert ? 'danger' : 'info',
        confirmText: action,
        onConfirm: async () => {
            try {
                if (isExpert) {
                    await axios.put(`/admin/users/${user._id}/revoke-expert`);
                    setUsers(users.map(u => u._id === user._id ? { ...u, roles: u.roles.filter(r => r !== 'expert') } : u));
                    alert(`Expert status revoked for ${user.name}`);
                } else {
                    const { data } = await axios.put(`/admin/users/${user._id}/grant-expert`);
                    setUsers(users.map(u => u._id === user._id ? { ...u, roles: data.roles } : u));
                    alert(`User ${user.name} is now an Expert.`);
                }
                closeConfirmModal();
            } catch (error) {
                console.error("Error updating expert role:", error);
                alert(error.response?.data?.message || `Failed to ${action.toLowerCase()}`);
            }
        }
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users..."
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
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Roles</th>
                <th className="p-4 font-medium">Joint Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map(user => {
                const isOnline = onlineUsers?.includes(user._id);
                return (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="relative bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg">
                            <User size={20} className="text-violet-600 dark:text-violet-400" />
                            {/* Online Status Dot */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                {isOnline && <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">Online</span>}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {user.roles && user.roles.map(role => (
                            <span key={role} className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                role === 'admin' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                : role === 'expert'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : role === 'moderator'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                : role === 'inquiry_support'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                                {role}
                            </span>
                        ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {/* Only Admins can promote/demote other Admins and Moderators */}
                    {currentUser?.roles?.includes('admin') && (
                        <>
                            <button 
                                onClick={() => handleToggleAdmin(user)}
                                className={`p-2 rounded-lg transition-colors ${
                                    user.roles?.includes('admin')
                                    ? 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20'
                                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                }`}
                                title={user.roles?.includes('admin') ? "Remove Admin" : "Make Admin"}
                            >
                                {user.roles?.includes('admin') ? <Shield size={18} /> : <ShieldOff size={18} />}
                            </button>
                            
                            <button 
                                onClick={() => handleToggleModerator(user)}
                                className={`p-2 rounded-lg transition-colors ${
                                    user.roles?.includes('moderator')
                                    ? 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
                                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                }`}
                                title={user.roles?.includes('moderator') ? "Remove Moderator" : "Make Moderator"}
                            >
                                <User size={18} className={user.roles?.includes('moderator') ? "fill-current" : ""} />
                            </button>
                        </>
                    )}

                    {/* Admins and Moderators can assign Inquiry Support */}
                    {/* But Moderators cannot modify Admins/Moderators */}
                    {((currentUser?.roles?.includes('admin')) || 
                      (currentUser?.roles?.includes('moderator') && !user.roles.includes('admin') && !user.roles.includes('moderator'))) && (
                        <button 
                            onClick={() => handleToggleSupport(user)}
                            className={`p-2 rounded-lg transition-colors ${
                                user.roles?.includes('inquiry_support')
                                ? 'text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20'
                                : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            }`}
                            title={user.roles?.includes('inquiry_support') ? "Remove Inquiry Support" : "Make Inquiry Support"}
                        >
                            <Headset size={18} />
                        </button>
                    )}

                    {/* Admins and Moderators can Toggle Expert Status */}
                    {((currentUser?.roles?.includes('admin')) || 
                      (currentUser?.roles?.includes('moderator') && !user.roles.includes('admin') && !user.roles.includes('moderator'))) && (
                        <button 
                            onClick={() => handleToggleExpert(user)}
                            className={`p-2 rounded-lg transition-colors ${
                                user.roles?.includes('expert')
                                ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            }`}
                            title={user.roles?.includes('expert') ? "Revoke Expert Status" : "Make Expert"}
                        >
                            {user.roles?.includes('expert') ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                    )}

                    {/* Only Admins can delete users */}
                    {currentUser?.roles?.includes('admin') && (
                        <button 
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete User"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                  </td>
                </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No users found matching your search.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
};

export default AdminUsers;
