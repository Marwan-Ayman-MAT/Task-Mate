import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Auth } from './Auth';
import App from '../App';
import { Toaster } from 'sonner@2.0.3';

export default function AppWithAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          setAccessToken(session.access_token);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('taskmate_darkMode');
    if (savedDarkMode !== null) {
      try {
        const parsed = JSON.parse(savedDarkMode);
        setDarkMode(parsed);
        if (parsed) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Failed to load dark mode:', e);
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    setAccessToken(token);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    localStorage.removeItem('taskmate_tasks');
    localStorage.removeItem('taskmate_categories');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ 
          backgroundColor: darkMode ? '#0f1419' : '#ffffff',
          color: darkMode ? '#f3f4f6' : '#111827'
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>Loading TaskMate...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <>
        <Auth onAuthSuccess={handleAuthSuccess} darkMode={darkMode} />
        <Toaster theme={darkMode ? 'dark' : 'light'} position="bottom-right" richColors />
      </>
    );
  }

  return (
    <>
      <App accessToken={accessToken} onSignOut={handleSignOut} />
      <Toaster theme={darkMode ? 'dark' : 'light'} position="bottom-right" richColors />
    </>
  );
}
