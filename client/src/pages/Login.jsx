import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CardSwap, { Card } from '../components/CardSwap';
import { Mail, Lock, ArrowRight, Video, ShieldCheck, CreditCard, Eye, EyeOff } from 'lucide-react';
import ShimmerButton from '../components/magicui/ShimmerButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password, rememberMe);
      // Simulate slight delay for effect
      setTimeout(() => navigate('/dashboard'), 500); 
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        
        {/* Left Side: Visual/Branding */}
        <div className="relative hidden md:flex flex-col justify-start p-12 bg-zinc-900 text-white overflow-hidden min-h-[600px]">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-90"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
           
           <div className="relative z-10 mb-8">
             <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
             <p className="text-zinc-400 text-lg">
               Your gateway to expert advice.
             </p>
           </div>
           
           {/* Card Swap Animation */}
           <div className="relative w-full h-full flex-grow z-20">
             <CardSwap
                cardDistance={40}
                verticalDistance={30}
                delay={4000}
                pauseOnHover={true}
                width={260}
                height={300}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                  <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                    <Video size={40} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Instant Video</h3>
                  <p className="text-sm text-zinc-300">Connect 1:1 with verified experts instantly.</p>
                </Card>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                  <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                     <ShieldCheck size={40} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Verified Pros</h3>
                  <p className="text-sm text-zinc-300">Every expert is vetted for quality and skill.</p>
                </Card>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                   <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                     <CreditCard size={40} className="text-white" />
                   </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Secure Pay</h3>
                  <p className="text-sm text-zinc-300">Your transactions are safe and encrypted.</p>
                </Card>
              </CardSwap>
           </div>

           {/* Decorative Circles */}
           {/* Decorative Circles - Neutral/Dark tones */}
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-indigo-700">Forgot password?</a>
               </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <span className="flex items-center">
                  Login to Dashboard <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 dark:bg-gray-900">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
             </button>
             <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
               <img src="https://www.svgrepo.com/show/448234/github.svg" className="h-5 w-5 mr-2 dark:invert" alt="GitHub" />
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
