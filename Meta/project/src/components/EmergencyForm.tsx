import React, { useState } from 'react';
import { AlertTriangle, Phone, Mail, User, FileText, Send, Check, X } from 'lucide-react';

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Props { onClose?: () => void; }

const EMERGENCY_TYPES = [
  'بازداشت توسط مراجع امنیتی',
  'تهدید جانی فوری',
  'اخراج اجباری',
  'خشونت خانگی',
  'پرونده در خطر انقضا',
  'وضعیت پناهندگی تهدید شده',
  'سایر',
];

export function EmergencyForm({ onClose }: Props) {
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
      await fetch(SHEETDB_API_URL, {
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

  return (
    <section id="emergency" className="py-16 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-red-200 dark:border-red-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-red-600 to-red-500 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-xl">فرم تماس اضطراری</h2>
                <p className="text-red-100 text-sm">در صورت وضعیت اورژانسی این فرم را پر کنید</p>
              </div>
            </div>
            {/* Emergency contact bar */}
            <div className="mt-4 p-3 bg-white/15 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Phone className="w-4 h-4" />
                واتساپ اضطراری: +989012055578
              </div>
              <a href="https://wa.me/989012055578?text=اورژانس"
                target="_blank" rel="noopener noreferrer"
                className="px-4 py-1.5 bg-white text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">
                تماس فوری
              </a>
            </div>
          </div>

          {success ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">درخواست اضطراری ثبت شد</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">تیم ما در اسرع وقت با شما تماس خواهد گرفت.</p>
              <a href="https://wa.me/989012055578" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                واتساپ برای پیگیری فوری
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  این فرم برای وضعیت‌های اورژانسی است. برای خطر فوری جانی، با پلیس محلی تماس بگیرید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'نام کامل *', key: 'name', icon: <User className="w-4 h-4" />, type: 'text', placeholder: 'نام و تخلص' },
                  { label: 'شماره واتساپ *', key: 'phone', icon: <Phone className="w-4 h-4" />, type: 'tel', placeholder: '+93 700 000 000' },
                  { label: 'ایمیل', key: 'email', icon: <Mail className="w-4 h-4" />, type: 'email', placeholder: 'example@email.com' },
                  { label: 'شماره پاسپورت', key: 'passport', icon: <FileText className="w-4 h-4" />, type: 'text', placeholder: 'AA1234567' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                    <div className="relative">
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{f.icon}</div>
                      <input
                        type={f.type}
                        value={(form as any)[f.key]}
                        onChange={e => update(f.key as any, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">نوع وضعیت اضطراری *</label>
                <select
                  value={form.emergencyType}
                  onChange={e => update('emergencyType', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-400 outline-none"
                >
                  <option value="">انتخاب کنید...</option>
                  {EMERGENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">موقعیت فعلی</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder="شهر، کشور"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">شرح وضعیت</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="وضعیت خود را به اختصار توضیح دهید..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 outline-none resize-none"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow hover:shadow-red-600/30 disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'در حال ارسال...' : 'ارسال درخواست اضطراری'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
