import { useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { CheckSquare, Mail, Lock, User } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle specific error for unconfirmed email
          if (error.message.includes('Email not confirmed')) {
            toast.error('⚠️ Please check your email to confirm your account, or disable email confirmation in Supabase settings.', {
              duration: 6000,
            });
            setLoading(false);
            return; // Don't throw error, just return
          }
          throw error;
        }

        if (data.user) {
          toast.success('Welcome back! 🎉');
          onAuthSuccess();
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            // Disable email confirmation for development
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            // Email already exists, user needs to confirm
            toast.info('📧 This email is already registered. Please check your inbox to confirm your account, or try signing in.', {
              duration: 7000,
            });
            setLoading(false);
            return; // Don't throw error
          } else if (data.user.confirmed_at === null) {
            // New user, email confirmation required
            toast.info('📧 Account created! Please check your email to confirm your account. After confirmation, you can sign in.', {
              duration: 7000,
            });
            setLoading(false);
            return; // Don't throw error
          } else {
            // Email confirmation disabled or already confirmed
            toast.success('Account created successfully! 🎉');
            onAuthSuccess();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1419] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-100 text-3xl mb-2">TaskMate</h1>
          <p className="text-gray-400">Stay organized, stay productive</p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#1a2332] rounded-xl shadow-xl p-8 border border-gray-800">
          <div className="mb-6">
            <h2 className="text-gray-100 text-2xl mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin
                ? 'Sign in to access your tasks'
                : 'Sign up to start organizing your tasks'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">📝</div>
            <p className="text-gray-400 text-xs">Task Management</p>
          </div>
          <div>
            <div className="text-2xl mb-1">📅</div>
            <p className="text-gray-400 text-xs">Smart Scheduling</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🏷️</div>
            <p className="text-gray-400 text-xs">Categories</p>
          </div>
        </div>

        {/* Email Confirmation Instructions */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-500 text-xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-yellow-200 text-sm mb-2">Email Confirmation Currently Enabled</h3>
              <p className="text-yellow-300/80 text-xs mb-3">
                To use the app without email verification, disable confirmation in Supabase:
              </p>
              <ol className="text-yellow-300/80 text-xs space-y-1 list-decimal list-inside mb-3">
                <li>Open <a href="https://supabase.com/dashboard/project/ciwmzxrbcjhakzllfffj/auth/providers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Supabase Dashboard</a></li>
                <li>Click on "Email" provider</li>
                <li>Toggle OFF "Confirm email"</li>
                <li>Click "Save"</li>
                <li>Reload this page</li>
              </ol>
              <p className="text-yellow-300/80 text-xs">
                ✅ <strong>Alternative:</strong> Use a valid email to receive confirmation link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}