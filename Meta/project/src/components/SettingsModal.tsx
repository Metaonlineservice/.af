import React, { useState } from 'react';
import { X, Moon, Sun, Monitor, Lock, LogOut, Check, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export function SettingsModal({ onClose, onLogout }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'theme' | 'password'>('theme');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (!oldPass || !newPass || !confirmPass) { setPassError('تمام فیلدها الزامی هستند'); return; }
    if (newPass !== confirmPass) { setPassError('رمز جدید و تکرار آن یکسان نیستند'); return; }
    if (newPass.length < 6) { setPassError('رمز جدید باید حداقل ۶ کاراکتر باشد'); return; }

    setLoading(true);
    try {
      // Verify old password
      const res = await fetch(`${SHEETDB_API_URL}/search?sheet=users&email=${encodeURIComponent(user!.email)}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0 || data[0].password !== oldPass) {
        setPassError('رمز عبور فعلی اشتباه است');
        setLoading(false);
        return;
      }
      // Update password
      await fetch(`${SHEETDB_API_URL}/email/${encodeURIComponent(user!.email)}?sheet=users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { password: newPass } }),
      });
      setPassSuccess(true);
      setOldPass(''); setNewPass(''); setConfirmPass('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch {
      setPassError('خطا در تغییر رمز. دوباره تلاش کنید.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">تنظیمات</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {([['theme', 'تم ظاهری'], ['password', 'تغییر رمز']] as [string, string][]).map(([key, lbl]) => (
            <button key={key} onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              {lbl}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {activeTab === 'theme' ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">ظاهر برنامه را انتخاب کنید</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['light', 'روشن', <Sun className="w-5 h-5" />],
                  ['dark', 'تاریک', <Moon className="w-5 h-5" />],
                ] as [string, string, React.ReactNode][]).map(([val, lbl, icon]) => (
                  <button
                    key={val}
                    onClick={() => { if (theme !== val) toggleTheme(); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === val ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-600 hover:border-slate-400'}`}
                  >
                    <div className={`${theme === val ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{icon}</div>
                    <span className={`font-medium text-sm ${theme === val ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{lbl}</span>
                    {theme === val && <Check className="w-4 h-4 mr-auto text-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passError && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">{passError}</div>}
              {passSuccess && <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><Check className="w-4 h-4" />رمز عبور با موفقیت تغییر یافت</div>}

              {[
                { label: 'رمز عبور فعلی', val: oldPass, set: setOldPass, show: showOld, toggle: () => setShowOld(p => !p) },
                { label: 'رمز عبور جدید', val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(p => !p) },
                { label: 'تکرار رمز جدید', val: confirmPass, set: setConfirmPass, show: showNew, toggle: () => {} },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={f.show ? 'text' : 'password'}
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      className="w-full pr-9 pl-9 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                    {i < 2 && (
                      <button type="button" onClick={f.toggle} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
              </button>
            </form>
          )}

          {/* Logout */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold text-sm transition-all">
              <LogOut className="w-4 h-4" />
              خروج از حساب کاربری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
