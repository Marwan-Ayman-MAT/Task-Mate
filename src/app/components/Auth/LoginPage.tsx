import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckSquare } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  darkMode: boolean;
}

export function LoginPage({ onLogin, onSwitchToSignup, darkMode }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-[#0f1419]' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md ${
        darkMode ? 'bg-[#1a2332]' : 'bg-white'
      } rounded-2xl shadow-xl p-8`}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <CheckSquare className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className={`text-2xl mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Welcome Back
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Sign in to continue to TaskMate
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-sm mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-[#0f1419] border-gray-700 text-gray-300 placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-[#0f1419] border-gray-700 text-gray-300 placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-blue-500 transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className={`mt-6 text-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Sign up
          </button>
        </div>

        {/* Demo Info */}
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode ? 'bg-blue-600/10 border border-blue-600/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            💡 Create a new account or use any email to get started
          </p>
        </div>
      </div>
    </div>
  );
}
