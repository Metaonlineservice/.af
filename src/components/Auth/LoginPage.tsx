import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onClose: () => void;
}

export function LoginPage({ onSwitchToSignup, onClose }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'خطا در ورود');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated BG particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/30 rounded-full animate-particle"
            style={{
              left: `${(i * 8) + 4}%`,
              top: `${80 - (i * 6)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Header Strip */}
          <div className="bg-gradient-to-l from-gold-400 to-gold-500 p-6 text-center">
            <img src="/logo.png" alt="Meta Online Service" className="h-16 mx-auto mb-2 drop-shadow-lg" />
            <h2 className="text-xl font-bold text-slate-900">ورود به حساب کاربری</h2>
            <p className="text-slate-800/70 text-sm">خدمات آنلاین میتا</p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400 text-right animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  ایمیل آدرس
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  رمز عبور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full pr-10 pl-10 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-gold-400 to-gold-500 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-gold-400/30 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs text-slate-400">یا</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            </div>

            {/* Switch to Signup */}
            <button
              onClick={onSwitchToSignup}
              className="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:border-gold-400 hover:text-gold-500 transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              ثبت‌نام حساب جدید
            </button>

            {/* Back to home */}
            <button
              onClick={onClose}
              className="w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors py-2"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
