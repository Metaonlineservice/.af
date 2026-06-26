import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function SignupPage({ onSwitchToLogin, onClose }: SignupPageProps) {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    if (form.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signup({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'خطا در ثبت‌نام');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/30 rounded-full animate-particle"
            style={{
              left: `${(i * 9) + 5}%`,
              top: `${75 - (i * 7)}%`,
              animationDelay: `${i * 0.25}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
            }}
          />
        ))}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-l from-gold-400 to-gold-500 p-6 text-center">
            <img src="/logo.png" alt="Meta Online Service" className="h-16 mx-auto mb-2 drop-shadow-lg" />
            <h2 className="text-xl font-bold text-slate-900">ثبت‌نام حساب جدید</h2>
            <p className="text-slate-800/70 text-sm">خدمات آنلاین میتا</p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400 text-right animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">نام *</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => update('firstName', e.target.value)}
                      placeholder="نام"
                      className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">تخلص *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => update('lastName', e.target.value)}
                    placeholder="تخلص"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">ایمیل *</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">شماره تماس</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+93 700 000 000"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">رمز عبور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full pr-10 pl-10 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">تکرار رمز عبور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    placeholder="رمز عبور را تکرار کنید"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-gold-400 to-gold-500 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:from-gold-500 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-gold-400/30 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : <UserPlus className="w-5 h-5" />}
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs text-slate-400">یا</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            </div>

            <button
              onClick={onSwitchToLogin}
              className="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:border-gold-400 hover:text-gold-500 transition-all duration-300"
            >
              <LogIn className="w-5 h-5" />
              ورود با حساب موجود
            </button>

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
