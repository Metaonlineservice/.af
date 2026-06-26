import React, { useState } from 'react';
import { AlertTriangle, Phone, Mail, User, FileText, Send, Check, X } from 'lucide-react';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';
const EMERGENCY_TYPES = [
  'بازداشت توسط مراجع امنیتی',
  'تهدید جانی فوری',
  'اخراج اجباری',
  'خشونت خانگی',
  'پرونده در خطر انقضا',
  'وضعیت پناهندگی تهدید شده',
  'سایر',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', passport: '',
    emergencyType: '', description: '', location: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.emergencyType) {
      setError('نام، شماره تماس و نوع اضطرار الزامی است');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            id: 'EMG-' + Date.now().toString(36).toUpperCase(),
            created_at: new Date().toISOString(),
            type: 'emergency',
            name: form.name,
            phone: form.phone,
            email: form.email,
            passport: form.passport,
            emergency_type: form.emergencyType,
            description: form.description,
            location: form.location,
            status: 'urgent',
          }],
          sheet: 'emergency',
        }),
      });
      setSuccess(true);
    } catch {
      setError('خطا در ارسال. لطفاً مستقیماً با واتساپ تماس بگیرید: +989012055578');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-l from-red-600 to-red-500 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">تماس اضطراری</h2>
              <p className="text-red-100 text-xs">در وضعیت فوری این فرم را پر کنید</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Quick Contact */}
        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-3 flex items-center justify-between border-b border-red-200 dark:border-red-800 flex-shrink-0">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
            <Phone className="w-4 h-4" />
            واتساپ اضطراری: +989012055578
          </div>
          <a href="https://wa.me/989012055578?text=اورژانس" target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
            تماس فوری
          </a>
        </div>

        <div className="overflow-y-auto flex-1">
          {success ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">درخواست ثبت شد</h4>
              <p className="text-slate-500 mb-6">تیم ما در اسرع وقت با شما تماس می‌گیرد.</p>
              <button onClick={onClose} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors">
                بستن
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'نام کامل *', key: 'name', type: 'text', placeholder: 'نام و تخلص' },
                  { label: 'واتساپ *', key: 'phone', type: 'tel', placeholder: '+93 700 000 000' },
                  { label: 'ایمیل', key: 'email', type: 'email', placeholder: 'example@email.com' },
                  { label: 'پاسپورت', key: 'passport', type: 'text', placeholder: 'AA1234567' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={e => update(f.key as any, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نوع وضعیت اضطراری *</label>
                <select
                  value={form.emergencyType}
                  onChange={e => update('emergencyType', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none"
                >
                  <option value="">انتخاب کنید...</option>
                  {EMERGENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">موقعیت فعلی</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder="شهر، کشور"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">شرح وضعیت</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="وضعیت را به اختصار توضیح دهید..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none resize-none"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'در حال ارسال...' : 'ارسال درخواست اضطراری'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
