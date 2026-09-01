import { useState } from 'react';
import { CheckSquare, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { signUp, initializeDefaultCategories } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface AuthPageProps {
  onAuthSuccess: (accessToken: string) => void;
  darkMode: boolean;
}

export function AuthPage({ onAuthSuccess, darkMode }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.access_token) {
        localStorage.setItem('taskmate_access_token', data.session.access_token);
        toast.success('Welcome back! 👋');
        onAuthSuccess(data.session.access_token);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      toast.error('Login failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user via our API
      await signUp(email, password, name);

      // Now login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.access_token) {
        localStorage.setItem('taskmate_access_token', data.session.access_token);
        
        // Initialize default categories
        try {
          await initializeDefaultCategories();
        } catch (err) {
          console.error('Failed to initialize categories:', err);
        }

        toast.success('Account created successfully! 🎉');
        onAuthSuccess(data.session.access_token);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      toast.error('Signup failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ 
        backgroundColor: darkMode ? '#0f1419' : '#ffffff',
        color: darkMode ? '#f3f4f6' : '#111827'
      }}
    >
      <div 
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{
          backgroundColor: darkMode ? '#1a2332' : '#f9fafb',
          borderColor: darkMode ? '#374151' : '#d1d5db'
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2" style={{ color: darkMode ? '#f3f4f6' : '#111827' }}>
            TaskMate
          </h1>
          <p className="text-sm" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
            Your personal task management companion
          </p>
        </div>

        {/* Toggle between Login/Signup */}
        <div 
          className="flex rounded-lg p-1 mb-6"
          style={{ backgroundColor: darkMode ? '#0f1419' : '#e5e7eb' }}
        >
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              isLogin
                ? 'bg-blue-600 text-white shadow-md'
                : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              !isLogin
                ? 'bg-blue-600 text-white shadow-md'
                : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-3 rounded-lg flex items-center gap-2"
            style={{ 
              backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
              color: darkMode ? '#fca5a5' : '#991b1b'
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-2" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? '#6b7280' : '#9ca3af' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: darkMode ? '#0f1419' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#d1d5db',
                    color: darkMode ? '#f3f4f6' : '#111827'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? '#6b7280' : '#9ca3af' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: darkMode ? '#0f1419' : '#ffffff',
                  borderColor: darkMode ? '#374151' : '#d1d5db',
                  color: darkMode ? '#f3f4f6' : '#111827'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? '#6b7280' : '#9ca3af' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: darkMode ? '#0f1419' : '#ffffff',
                  borderColor: darkMode ? '#374151' : '#d1d5db',
                  color: darkMode ? '#f3f4f6' : '#111827'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm" style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
