import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await forgotPassword(email);
      setSuccess('Reset OTP sent to your email!');
      // Navigate to reset password page after a short delay, passing the email
      setTimeout(() => {
        // We can pass email in state to pre-fill it or just let them type it again
        // Let's rely on user check email for OTP.
        // Actually, it's better UX to redirect
        // But for now let's just show success and maybe a link or auto redirect
      }, 2000);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        <div className="mb-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email address to receive a verification code.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <span className="mr-2">✅</span> {success}
            <Link to="/reset-password" className="ml-2 underline font-semibold">Reset here</Link>
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

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <span className="flex items-center">
                Send OTP <ArrowRight size={18} className="ml-2" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
