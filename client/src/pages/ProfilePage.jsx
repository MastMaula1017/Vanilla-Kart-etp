import { useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, login, updateUser } = useContext(AuthContext);
  // Actually, updating user in AuthContext usually requires a setUser method exposed. 
  // Checking AuthContext, it exposes 'user' and 'register'/'login'. It doesn't expose 'setUser'.
  // I should probably update AuthContext to expose a way to update the user state purely, or just trigger a re-fetch.
  // But for now, I'll just use the response to update localStorage and reload window or similar if needed, or better, add updateUser to context.
  
  // Let's rely on the fact that we can update localStorage and the token persists.
  
  const [activeTab, setActiveTab] = useState('details'); // details, password
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    
    // Expert fields
    specialization: user?.expertProfile?.specialization || '',
    hourlyRate: user?.expertProfile?.hourlyRate || '',
    bio: user?.expertProfile?.bio || '',
    
    // Password fields
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if(user) {
        setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            specialization: user.expertProfile?.specialization || '',
            hourlyRate: user.expertProfile?.hourlyRate || '',
            bio: user.expertProfile?.bio || ''
        }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await axios.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        expertProfile: user.role === 'expert' ? {
            specialization: formData.specialization,
            hourlyRate: formData.hourlyRate,
            bio: formData.bio
        } : undefined
      });
      
      // Update local storage
      // Update user in context and storage (handles local/session storage logic internally)
      updateUser(data);
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.put('/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
       setMessage({ type: 'error', text: error.response?.data?.message || 'Password update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Profile & Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
            <button 
                onClick={() => setActiveTab('details')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors ${activeTab === 'details' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400'}`}
            >
                <User size={18} />
                <span>Personal Details</span>
            </button>
            <button 
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors ${activeTab === 'password' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400'}`}
            >
                <Lock size={18} />
                <span>Security</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
             {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="mr-2" size={20} /> : <AlertCircle className="mr-2" size={20} />}
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
                {activeTab === 'details' ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="input-field pl-10" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="input-field pl-10" 
                                    />
                                </div>
                            </div>
                        </div>

                        {user?.role === 'expert' && (
                            <>
                                <hr className="border-gray-100 dark:border-zinc-800 my-6" />
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Expert Profile</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="input-label">Specialization</label>
                                        <input 
                                            type="text" 
                                            name="specialization" 
                                            value={formData.specialization} 
                                            onChange={handleChange} 
                                            className="input-field" 
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Hourly Rate (₹)</label>
                                        <input 
                                            type="number" 
                                            name="hourlyRate" 
                                            value={formData.hourlyRate} 
                                            onChange={handleChange} 
                                            className="input-field" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Bio (About You)</label>
                                    <textarea 
                                        name="bio" 
                                        rows="4" 
                                        value={formData.bio} 
                                        onChange={handleChange} 
                                        className="input-field min-h-[120px]" 
                                    ></textarea>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Change Password</h2>
                         <div>
                            <label className="input-label">Current Password</label>
                            <input 
                                type="password" 
                                name="currentPassword" 
                                value={formData.currentPassword} 
                                onChange={handleChange} 
                                className="input-field" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="input-label">New Password</label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                value={formData.newPassword} 
                                onChange={handleChange} 
                                className="input-field" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="input-label">Confirm New Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                className="input-field" 
                                required 
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
