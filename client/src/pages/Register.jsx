import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, IndianRupee, ArrowRight, UserCircle2, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import axios from '../utils/axios';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const { register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: queryParams.get('role') || 'customer',
    expertProfile: {
      specialization: '',
      hourlyRate: '',
      availability: {
          days: [],
          startTime: '09:00',
          endTime: '17:00'
      }
    }
  });

  // Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
      const currentDays = formData.expertProfile.availability.days || [];
      let newDays;
      if (currentDays.includes(day)) {
          newDays = currentDays.filter(d => d !== day);
      } else {
          newDays = [...currentDays, day];
      }
      setFormData({
          ...formData,
          expertProfile: {
              ...formData.expertProfile,
              availability: { 
                  ...formData.expertProfile.availability, 
                  days: newDays 
              }
          }
      });
  };

  const handleTimeChange = (e) => {
      setFormData({
          ...formData,
          expertProfile: {
              ...formData.expertProfile,
              availability: {
                  ...formData.expertProfile.availability,
                  [e.target.name]: e.target.value
              }
          }
      });
  };
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      expertProfile: { ...formData.expertProfile, [e.target.name]: e.target.value }
    });
  };

  const handleSendOtp = async () => {
      if (!formData.email) {
          setError('Please enter an email address first.');
          return;
      }
      setIsLoading(true);
      setError('');
      try {
          await axios.post('/auth/verify-email/send', { email: formData.email });
          setOtpSent(true);
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to send OTP');
      } finally {
          setIsLoading(false);
      }
  };

  const handleVerifyOtp = async () => {
      if (!otp) {
          setError('Please enter the OTP.');
          return;
      }
      setVerifying(true);
      setError('');
      try {
          await axios.post('/auth/verify-email/validate', { email: formData.email, otp });
          setEmailVerified(true);
          setOtpSent(false); // Hide OTP field
      } catch (err) {
          setError(err.response?.data?.message || 'Invalid OTP');
      } finally {
          setVerifying(false);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
        setError('Please verify your email address before creating an account.');
        return;
    }

    setIsLoading(true);
    setError('');
    
    // Prepare data for submission (Transform availability)
    let submissionData = { ...formData };
    if (formData.role === 'expert') {
        // Validate availability days
        if (formData.expertProfile.availability.days.length === 0) {
            setFieldErrors({...fieldErrors, availability: true});
            // Also validate other fields manually if needed, but required attribute handles them mostly.
            // Just ensure we don't proceed.
            // Check other visual validations
            const errors = {};
            if (!formData.expertProfile.specialization) errors.specialization = true;
            if (!formData.expertProfile.hourlyRate) errors.hourlyRate = true;
            else if (Number(formData.expertProfile.hourlyRate) < 200) {
                errors.hourlyRate = true;
                setError('Hourly rate must be at least ₹200');
            }
            if (formData.expertProfile.availability.days.length === 0) errors.availability = true;
            
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                setIsLoading(false);
                return;
            }
        }

        const { days, startTime, endTime } = formData.expertProfile.availability;
        const formattedAvailability = days.map(day => ({
            day,
            startTime,
            endTime,
            isActive: true
        }));
        
        submissionData = {
            ...formData,
            expertProfile: {
                ...formData.expertProfile,
                availability: formattedAvailability
            }
        };
    }

    try {
      await register(submissionData);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const handleGoogleSuccess = async (response) => {
      // Client-side validation for Expert Google Login
      if (formData.role === 'expert') {
          const errors = {};
          if (!formData.expertProfile.specialization) errors.specialization = true;
          if (!formData.expertProfile.hourlyRate) errors.hourlyRate = true;
          else if (Number(formData.expertProfile.hourlyRate) < 200) {
              errors.hourlyRate = true;
              setError('Hourly rate must be at least ₹200');
          }
          if (formData.expertProfile.availability.days.length === 0) errors.availability = true;

          if (Object.keys(errors).length > 0) {
              setFieldErrors(errors);
              // Check if availability error exists specifically to customize message or general message
              setError('Please fill in the required expert details below to continue with Google.');
              return;
          }
      }
      // Clear errors if valid
      setFieldErrors({});

      // Prepare data for Google Login (Transform availability)
      let expertProfileData = undefined;
      if (formData.role === 'expert') {
          const { days, startTime, endTime } = formData.expertProfile.availability;
          const formattedAvailability = days.map(day => ({
              day,
              startTime,
              endTime,
              isActive: true
          }));
          expertProfileData = {
              ...formData.expertProfile,
              availability: formattedAvailability
          };
      }

      try {
          setIsLoading(true);
          await googleLogin(response.credential, {
             role: formData.role,
             expertProfile: expertProfileData
          });
          navigate('/dashboard');
      } catch (err) {
          setError(err.message || 'Google Login Failed');
          setError(err.message || 'Google Login Failed');
          setIsLoading(false);
      }
  };
  
  // If verifying email, show OTP related errors directly via 'error' state which is rendered below form header
  // So no changes needed for error display.

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        
        {/* Left Side: Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
          </div>

          {error && (
            <div className={`border px-4 py-2.5 rounded-lg mb-6 text-sm flex items-center ${
                error.includes('already signed up') 
                ? 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
            }`}>
              <span className="mr-2">{error.includes('already signed up') ? 'ℹ️' : '⚠️'}</span> 
              {error}
              {error.includes('already signed up') && (
                  <Link to="/login" className="ml-2 underline font-semibold hover:text-amber-900 dark:hover:text-amber-300">Login now</Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div 
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                  formData.role === 'customer' 
                  ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                 <UserCircle2 size={24} className={`mb-1 ${formData.role === 'customer' ? 'text-primary' : 'text-gray-400'}`} />
                 <span className={`text-sm font-semibold ${formData.role === 'customer' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Customer</span>
              </div>
              <div 
                onClick={() => setFormData({...formData, role: 'expert'})}
                 className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                  formData.role === 'expert' 
                  ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                 <Briefcase size={24} className={`mb-1 ${formData.role === 'expert' ? 'text-primary' : 'text-gray-400'}`} />
                 <span className={`text-sm font-semibold ${formData.role === 'expert' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Expert</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email Address</label>
              
              <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      name="email"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary ${emailVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200'}`}
                      value={formData.email}
                      onChange={(e) => {
                          handleChange(e);
                          if(emailVerified) setEmailVerified(false);
                          if(otpSent) setOtpSent(false);
                      }}
                      required
                      placeholder="john@example.com"
                      readOnly={emailVerified}
                    />
                  </div>

                  {emailVerified ? (
                      <div className="flex items-center justify-center text-green-600 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-4 rounded-lg border border-green-200 dark:border-green-800 shrink-0">
                          <CheckCircle2 size={18} className="mr-1.5" />
                          Verified
                      </div>
                  ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading || !formData.email}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-sm shrink-0"
                      >
                          {isLoading ? 'Sending...' : 'Verify'}
                      </button>
                  )}
              </div>
              
              {/* OTP Input */}
              {otpSent && !emailVerified && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                      <div className="flex gap-2">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            maxLength={6}
                        />
                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={verifying}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
                        >
                            {verifying ? '...' : 'Confirm'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-1">Check your email inbox for the code.</p>
                  </div>
              )}
            </div>
            
            <div className={`space-y-1.5 transition-opacity duration-300 ${!emailVerified ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  disabled={!emailVerified}
                />
              </div>
            </div>

            {formData.role === 'expert' && (
              <div className={`bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg space-y-3 border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-300 transition-opacity ${!emailVerified ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wide">Expert Profile Details</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Specialization <span className="text-red-500">*</span></label>
                  <div className="relative group">
                     <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="specialization"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white ${
                          fieldErrors.specialization 
                          ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-200 focus:border-primary dark:border-gray-700 dark:focus:border-primary'
                      }`}
                      placeholder="e.g. Finance, Education"
                      value={formData.expertProfile.specialization}
                      onChange={(e) => {
                          handleProfileChange(e);
                          if(fieldErrors.specialization && e.target.value) {
                              setFieldErrors({...fieldErrors, specialization: false});
                          }
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Hourly Rate (₹) <span className="text-red-500">*</span> <span className="text-red-500 text-xs ml-1">(Min ₹200)</span></label>
                  <div className="relative group">
                     <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      name="hourlyRate"
                       className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:text-white ${
                          fieldErrors.hourlyRate 
                          ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-200 focus:border-primary dark:border-gray-700 dark:focus:border-primary'
                      }`}
                      value={formData.expertProfile.hourlyRate}
                      onChange={(e) => {
                          handleProfileChange(e);
                          if(fieldErrors.hourlyRate && e.target.value) {
                              setFieldErrors({...fieldErrors, hourlyRate: false});
                              if (Number(e.target.value) >= 200 && error === 'Hourly rate must be at least ₹200') setError('');
                          }
                      }}
                      required
                      min="200"
                      placeholder="Min 200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Availability (Days) <span className="text-red-500">*</span></label>
                  <div className={`flex flex-wrap gap-2 p-2 rounded-lg border transition-colors ${
                      fieldErrors.availability
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-transparent'
                  }`}>
                      {availableDays.map(day => (
                          <button
                              key={day}
                              type="button"
                              onClick={() => {
                                  toggleDay(day);
                                  if(fieldErrors.availability) {
                                      setFieldErrors({...fieldErrors, availability: false});
                                  }
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                  formData.expertProfile.availability.days.includes(day)
                                  ? 'bg-primary border-primary text-white'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                              }`}
                          >
                              {day.slice(0, 3)}
                          </button>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Start Time</label>
                        <div className="relative group">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="time"
                                name="startTime"
                                className="w-full pl-10 pr-2 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                                value={formData.expertProfile.availability.startTime}
                                onChange={handleTimeChange}
                            />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">End Time</label>
                        <div className="relative group">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                             <input
                                type="time"
                                name="endTime"
                                className="w-full pl-10 pr-2 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                                value={formData.expertProfile.availability.endTime}
                                onChange={handleTimeChange}
                            />
                        </div>
                     </div>
                </div>

              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || !emailVerified}
              className="w-full bg-primary hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center mt-2 text-sm"
            >
               {isLoading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white px-2 text-gray-400 dark:bg-gray-900">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
             <div className="w-full overflow-hidden flex justify-center transform hover:scale-[1.02] transition-transform duration-200">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Login Failed')}
                    theme="filled_blue"
                    shape="pill"
                    width="300" 
                />
             </div>
          </div>
        </div>

        {/* Right Side: Visual/Branding (Reused/Swapped) */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-gray-900 text-white overflow-hidden order-1 md:order-2">
           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 opacity-90"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
           
           <div className="relative z-10 text-right">
             <h2 className="text-4xl font-bold mb-6">Join the Community</h2>
             <p className="text-gray-300 text-lg mb-8 leading-relaxed">
               Whether you're looking for advice or planning to share your expertise, you're in the right place.
             </p>
             <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left transform rotate-2 hover:rotate-0 transition-transform duration-500 mb-6">
             <a href="" target="" rel="">

               <p className="italic text-gray-200 mb-4">"The streamlined booking process and crystal-clear video calls make consulting a breeze. Highly recommended!"</p>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">H</div>
                 <div>
                   <p className="font-bold text-white">Harsh</p>
                   <p className="text-xs text-gray-400">Customer</p>
                 </div>
               </div>
              </a>
             </div>
             <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left transform -rotate-2 hover:rotate-0 transition-transform duration-500">
             <a href="#" target="" rel="">

               <p className="italic text-gray-200 mb-4">"I found the perfect expert for my project within minutes. The insights I gained were game-changing for my career."</p>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold">S</div>
                 <div>
                   <p className="font-bold text-white">Sarthak</p>
                   <p className="text-xs text-gray-400">Customer</p>
                 </div>
               </div>
              </a>
             </div>
           </div>

           {/* Decorative Blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};

export default Register;
