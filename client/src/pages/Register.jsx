import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, IndianRupee, ArrowRight, UserCircle2 } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        
        {/* Left Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                  formData.role === 'customer' 
                  ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                 <UserCircle2 size={32} className={`mb-2 ${formData.role === 'customer' ? 'text-primary' : 'text-gray-400'}`} />
                 <span className={`font-semibold ${formData.role === 'customer' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Customer</span>
              </div>
              <div 
                onClick={() => setFormData({...formData, role: 'expert'})}
                 className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                  formData.role === 'expert' 
                  ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                 <Briefcase size={32} className={`mb-2 ${formData.role === 'expert' ? 'text-primary' : 'text-gray-400'}`} />
                 <span className={`font-semibold ${formData.role === 'expert' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Expert</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {formData.role === 'expert' && (
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl space-y-4 border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm uppercase tracking-wide">Expert Profile Details</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                  <div className="relative">
                     <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="specialization"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="e.g. Finance, Education"
                      value={formData.expertProfile.specialization}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hourly Rate (₹)</label>
                  <div className="relative">
                     <IndianRupee className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="hourlyRate"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center mt-2"
            >
               {isLoading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
          </form>
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
             <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <a href="https://www.linkedin.com/in/003va/" target="_blank">

               <p className="italic text-gray-200 mb-4">"This platform transformed how I network. The experts are top-notch and the video quality is seamless."</p>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">VR</div>
                 <div>
                   <p className="font-bold text-white">vansh Raturi</p>
                   <p className="text-xs text-gray-400">Developer</p>
                 </div>
               </div>
              </a>
             </div>
             <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <a href="https://www.linkedin.com/in/chaitanya-kalra-022b62291/" target="_blank">

               <p className="italic text-gray-200 mb-4">"This platform transformed how I network. The experts are top-notch and the video quality is seamless."</p>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">CK</div>
                 <div>
                   <p className="font-bold text-white">Chaitanya Kalra</p>
                   <p className="text-xs text-gray-400">Developer</p>
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
