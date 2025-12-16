import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, IndianRupee, ArrowRight, UserCircle2 } from 'lucide-react';
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
      hourlyRate: ''
    }
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(formData);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
      try {
          setIsLoading(true);
          await googleLogin(response.credential, {
             role: formData.role,
             expertProfile: formData.role === 'expert' ? formData.expertProfile : undefined
          });
          navigate('/dashboard');
      } catch (err) {
          setError('Google Login Failed');
          setIsLoading(false);
      }
  };

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
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-lg mb-6 text-sm flex items-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <span className="mr-2">⚠️</span> {error}
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
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
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
                />
              </div>
            </div>

            {formData.role === 'expert' && (
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg space-y-3 border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wide">Expert Profile Details</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Specialization</label>
                  <div className="relative group">
                     <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="specialization"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                      placeholder="e.g. Finance, Education"
                      value={formData.expertProfile.specialization}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Hourly Rate (₹)</label>
                  <div className="relative group">
                     <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      name="hourlyRate"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                      value={formData.expertProfile.hourlyRate}
                      onChange={handleProfileChange}
                      required
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center mt-2 text-sm"
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
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">VR</div>
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
                 <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold">CK</div>
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
