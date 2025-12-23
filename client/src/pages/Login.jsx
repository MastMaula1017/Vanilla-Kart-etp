import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CardSwap, { Card } from '../components/CardSwap';
import { Mail, Lock, ArrowRight, Video, ShieldCheck, CreditCard, Eye, EyeOff } from 'lucide-react';
import ShimmerButton from '../components/magicui/ShimmerButton';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
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

  const handleGoogleSuccess = async (response) => {
      try {
          setIsLoading(true);
          await googleLogin(response.credential);
          navigate('/dashboard');
      } catch (err) {
          setError('Google Login Failed');
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        
        {/* Left Side: Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-lg mb-6 text-sm flex items-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-indigo-700">Forgot password?</Link>
               </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight size={16} className="ml-2" />
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

        {/* Right Side: Visual/Branding */}
        <div className="relative hidden md:flex flex-col justify-start p-10 bg-zinc-900 text-white overflow-hidden min-h-[500px]">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-90"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
           
           <div className="relative z-10 mb-8">
             <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
             <p className="text-zinc-400 text-base">
               Your gateway to expert advice.
             </p>
           </div>
           
           {/* Card Swap Animation */}
           <div className="relative w-full h-full flex-grow z-20 scale-90 origin-top-left">
             <CardSwap
                cardDistance={40}
                verticalDistance={30}
                delay={4000}
                pauseOnHover={true}
                width={240}
                height={280}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                  <div className="bg-white/10 p-3 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                    <Video size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Instant Video</h3>
                  <p className="text-xs text-zinc-300">Connect 1:1 with verified experts instantly.</p>
                </Card>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                  <div className="bg-white/10 p-3 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                     <ShieldCheck size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Verified Pros</h3>
                  <p className="text-xs text-zinc-300">Every expert is vetted for quality and skill.</p>
                </Card>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                   <div className="bg-white/10 p-3 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                     <CreditCard size={32} className="text-white" />
                   </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Secure Pay</h3>
                  <p className="text-xs text-zinc-300">Your transactions are safe and encrypted.</p>
                </Card>
              </CardSwap>
           </div>

           {/* Decorative Circles */}
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
