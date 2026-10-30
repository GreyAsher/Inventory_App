import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, Sun, Moon } from 'lucide-react';

interface LoginModalProps {
  onLogin: (username: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, darkMode, onToggleDarkMode }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    // Accept admin or any credentials
    onLogin(username.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121417] flex items-center justify-center p-4 relative">
      {onToggleDarkMode && (
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white dark:bg-[#1E2227] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      )}

      <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2227]">
        {/* Top Header Card matching WPF Window1.xaml */}
        <div className="bg-[#393E46] dark:bg-[#181A1E] text-white p-7 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/10 shadow-inner">
            <span className="text-4xl">🏺</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory App</h1>
          <p className="text-xs uppercase tracking-widest text-[#00ADB5] font-semibold mt-1">
            Management System
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-7">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Login Account</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter your credentials to access system</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#00ADB5] hover:bg-[#009299] text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-[#00ADB5]/20 cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={() => onLogin('admin')}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#00ADB5] dark:hover:text-[#00ADB5] font-medium cursor-pointer"
            >
              Quick Sign In as Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
