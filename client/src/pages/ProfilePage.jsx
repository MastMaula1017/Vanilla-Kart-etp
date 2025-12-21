import { useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, Shield, Briefcase, IndianRupee, FileText, Loader, Clock } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('details'); 
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    // Expert fields
    specialization: user?.expertProfile?.specialization || '',
    hourlyRate: user?.expertProfile?.hourlyRate || '',
    bio: user?.expertProfile?.bio || '',
    availability: user?.expertProfile?.availability?.length > 0 ? user.expertProfile.availability : [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: false },
        { day: 'Sunday', startTime: '10:00', endTime: '14:00', isActive: false },
    ],
    // Password fields
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if(user) {
        // Create full week template to ensure all days are shown
        const fullWeekTemplate = [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', startTime: '09:00', endTime: '17:00' },
            { day: 'Saturday', startTime: '10:00', endTime: '14:00' },
            { day: 'Sunday', startTime: '10:00', endTime: '14:00' },
        ];

        // Merge existing user availability with template
        const mergedAvailability = fullWeekTemplate.map(template => {
            const userDay = user.expertProfile?.availability?.find(d => d.day === template.day);
            if (userDay) {
                // Return the saved state, respecting isActive flag from DB
                return { ...userDay }; 
            }
            return { ...template, isActive: false };
        });

        setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            specialization: user.expertProfile?.specialization || '',
            hourlyRate: user.expertProfile?.hourlyRate || '',
            bio: user.expertProfile?.bio || '',
            availability: mergedAvailability
        }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(message) setMessage(null);
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index][field] = value;
    setFormData({ ...formData, availability: newAvailability });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (user.roles?.includes('expert') && Number(formData.hourlyRate) < 200) {
        setMessage({ type: 'error', text: 'Hourly rate must be at least ₹200' });
        setLoading(false);
        return;
    }
    try {
      const { data } = await axios.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        expertProfile: user.roles?.includes('expert') ? {
            specialization: formData.specialization,
            hourlyRate: formData.hourlyRate,
            bio: formData.bio,
            availability: formData.availability
        } : undefined
      });
      
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

  // Shared Input Styles
  const inputGroupClass = "space-y-2";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputWrapperClass = "relative";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400";
  const inputClass = "w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your personal information and security preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
            <button 
                onClick={() => setActiveTab('details')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all font-medium ${
                    activeTab === 'details' 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
                <User size={18} />
                <span>Personal Profile</span>
            </button>
            <button 
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all font-medium ${
                    activeTab === 'password' 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
                <Shield size={18} />
                <span>Security</span>
            </button>
            {user?.roles?.includes('expert') && (
                <>
                    <button 
                        onClick={() => setActiveTab('availability')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all font-medium ${
                            activeTab === 'availability' 
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <Clock size={18} />
                        <span>Availability</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('verification')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all font-medium ${
                            activeTab === 'verification' 
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <CheckCircle size={18} />
                        <span>Verification</span>
                    </button>
                </>
            )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
             {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start border ${
                    message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle className="mr-3 mt-0.5" size={20} /> : <AlertCircle className="mr-3 mt-0.5" size={20} />}
                    <div>
                        <h4 className="font-semibold">{message.type === 'success' ? 'Success' : 'Error'}</h4>
                        <p className="text-sm opacity-90">{message.text}</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                <div className="p-8">
                    {activeTab === 'details' ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <User className="mr-2 text-violet-500" size={24} />
                                    Basic Information
                                </h2>

                                {/* Profile Image Upload */}
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-lg">
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 dark:text-indigo-400 text-3xl font-bold">
                                                    {user?.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                                            <span className="text-xs font-bold uppercase tracking-wider">Edit</span>
                                        </label>
                                        <input 
                                            id="profile-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if(!file) return;

                                                const formData = new FormData();
                                                formData.append('image', file);
                                                
                                                try {
                                                    setLoading(true);
                                                    const { data } = await axios.post('/auth/profile/image', formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    updateUser(data);
                                                    setMessage({ type: 'success', text: 'Profile photo updated' });
                                                } catch (error) {
                                                    setMessage({ type: 'error', text: 'Failed to upload image' });
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Allowed formats: JPG, PNG, WEBP. Max size: 5MB.</p>
                                    </div>
                                </div>

                                {/* Cover Image Upload */}
                                {user?.roles?.includes('expert') && (
                                    <div className="flex items-center space-x-6 mb-8">
                                        <div className="relative group w-full max-w-md h-32 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-zinc-800">
                                            {user?.coverImage ? (
                                                <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="text-sm font-medium">No Cover Image</span>
                                                </div>
                                            )}
                                            <label htmlFor="cover-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                                                <span className="text-xs font-bold uppercase tracking-wider flex items-center">
                                                    <Shield size={16} className="mr-2" /> Change Cover
                                                </span>
                                            </label>
                                            <input 
                                                id="cover-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if(!file) return;

                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    
                                                    try {
                                                        setLoading(true);
                                                        const { data } = await axios.post('/auth/profile/cover', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        updateUser(data);
                                                        setMessage({ type: 'success', text: 'Cover photo updated' });
                                                    } catch (error) {
                                                        setMessage({ type: 'error', text: 'Failed to upload cover' });
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cover Image</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Background for your expert profile.</p>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={inputGroupClass}>
                                        <label className={labelClass}>Full Name</label>
                                        <div className={inputWrapperClass}>
                                            <User className={iconClass} size={18} />
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                className={inputClass}
                                                placeholder="e.g. John Doe" 
                                            />
                                        </div>
                                    </div>
                                    <div className={inputGroupClass}>
                                        <label className={labelClass}>Email Address</label>
                                        <div className={inputWrapperClass}>
                                            <Mail className={iconClass} size={18} />
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                className={inputClass}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {user?.roles?.includes('expert') && (
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                        <Briefcase className="mr-2 text-violet-500" size={24} />
                                        Expert Profile
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className={inputGroupClass}>
                                            <label className={labelClass}>Specialization</label>
                                            <div className={inputWrapperClass}>
                                                <Briefcase className={iconClass} size={18} />
                                                <input 
                                                    type="text" 
                                                    name="specialization" 
                                                    value={formData.specialization} 
                                                    onChange={handleChange} 
                                                    className={inputClass}
                                                    placeholder="e.g. Corporate Law" 
                                                />
                                            </div>
                                        </div>
                                        <div className={inputGroupClass}>
                                            <label className={labelClass}>Hourly Rate (₹) <span className="text-red-500 text-xs ml-1">(Min ₹200)</span></label>
                                            <div className={inputWrapperClass}>
                                                <IndianRupee className={iconClass} size={18} />
                                                <input 
                                                    type="number" 
                                                    name="hourlyRate" 
                                                    value={formData.hourlyRate} 
                                                    onChange={handleChange} 
                                                    className={inputClass}
                                                    placeholder="2000"
                                                    min="200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={inputGroupClass}>
                                        <label className={labelClass}>Bio (About You)</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
                                            <textarea 
                                                name="bio" 
                                                rows="4" 
                                                value={formData.bio} 
                                                onChange={handleChange} 
                                                className={`${inputClass} pl-11 pt-4 min-h-[140px] resize-y`}
                                                placeholder="Tell clients about your experience and expertise..." 
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center"
                                >
                                    {loading ? (
                                        <>Updating...</>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : activeTab === 'verification' ? (
                        <div className="space-y-8">
                             <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <CheckCircle className="mr-2 text-violet-500" size={24} />
                                    Expert Verification
                                </h2>

                                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Status</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                                            user?.expertProfile?.verificationStatus === 'verified'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : user?.expertProfile?.verificationStatus === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : user?.expertProfile?.verificationStatus === 'rejected'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}>
                                            {user?.expertProfile?.verificationStatus || 'Unverified'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {user?.expertProfile?.verificationStatus === 'verified' 
                                            ? "Congratulations! Your profile is verified. You have the Blue Tick badge."
                                            : user?.expertProfile?.verificationStatus === 'pending'
                                            ? "Your verification documents have been submitted and are under review. This usually takes 24-48 hours."
                                            : "Upload your professional credentials (ID, Certificates, Licenses) to get verified and earn the Blue Tick badge."
                                        }
                                    </p>
                                </div>

                                {(!user?.expertProfile?.verificationStatus || user?.expertProfile?.verificationStatus === 'unverified' || user?.expertProfile?.verificationStatus === 'rejected') && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Documents</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            Please upload a clear copy of your Government ID or Professional Certificate. Supported formats: JPG, PNG, PDF.
                                        </p>

                                        <div className="max-w-xl">
                                            <div className="relative group w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-violet-50 dark:hover:bg-violet-900/10 hover:border-violet-400 transition-all cursor-pointer">
                                                {loading ? (
                                                    <div className="flex flex-col items-center animate-pulse">
                                                        <Loader size={40} className="text-violet-500 animate-spin mb-3" />
                                                        <span className="font-medium text-gray-500 dark:text-gray-400">Uploading...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input 
                                                            type="file" 
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if(!file) return;

                                                                const formData = new FormData();
                                                                formData.append('document', file);
                                                                
                                                                try {
                                                                    setLoading(true);
                                                                    const { data } = await axios.post('/auth/profile/verification', formData, {
                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                    });
                                                                    
                                                                    // Update local user state
                                                                    const updatedUser = { ...user };
                                                                    if (!updatedUser.expertProfile) updatedUser.expertProfile = {};
                                                                    updatedUser.expertProfile.verificationDocuments = data.verificationDocuments;
                                                                    updatedUser.expertProfile.verificationStatus = data.verificationStatus;
                                                                    
                                                                    updateUser(updatedUser);
                                                                    
                                                                    setMessage({ type: 'success', text: 'Document uploaded successfully. Status pending.' });
                                                                } catch (error) {
                                                                    setMessage({ type: 'error', text: 'Failed to upload document' });
                                                                } finally {
                                                                    setLoading(false);
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-violet-500 transition-colors">
                                                            <FileText size={40} className="mb-3" />
                                                            <span className="font-medium text-sm">Click to upload or drag and drop</span>
                                                            <span className="text-xs mt-1">Maximum file size: 5MB</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>

                    ) : activeTab === 'availability' ? (
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Clock className="mr-2 text-violet-500" size={24} />
                                Weekly Availability
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-4">
                                    {formData.availability.map((slot, index) => (
                                        <div key={slot.day} className="flex flex-col sm:flex-row sm:items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 gap-4">
                                            <div className="w-32 flex items-center space-x-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={slot.isActive}
                                                    onChange={(e) => handleAvailabilityChange(index, 'isActive', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                                />
                                                <span className={`font-medium ${slot.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                    {slot.day}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex-1">
                                                    <input 
                                                        type="time" 
                                                        value={slot.startTime}
                                                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                                        disabled={!slot.isActive}
                                                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <span className="text-gray-400">to</span>
                                                <div className="flex-1">
                                                    <input 
                                                        type="time" 
                                                        value={slot.endTime}
                                                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                                        disabled={!slot.isActive}
                                                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center"
                                    >
                                        {loading ? 'Saving...' : 'Save Availability'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Lock className="mr-2 text-violet-500" size={24} />
                                Change Password
                            </h2>

                            <div className={inputGroupClass}>
                                <label className={labelClass}>Current Password</label>
                                <div className={inputWrapperClass}>
                                    <Lock className={iconClass} size={18} />
                                    <input 
                                        type="password" 
                                        name="currentPassword" 
                                        value={formData.currentPassword} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                        required 
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>New Password</label>
                                    <div className={inputWrapperClass}>
                                        <Lock className={iconClass} size={18} />
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            value={formData.newPassword} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                            required 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Confirm New Password</label>
                                    <div className={inputWrapperClass}>
                                        <Lock className={iconClass} size={18} />
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                            required 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center"
                                >
                                    {loading ? (
                                        <>Updating...</>
                                    ) : (
                                        <>
                                            <Shield size={18} className="mr-2" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
