import React, { useState, useEffect } from 'react';
import { Users, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Customer {
  id: string;
  name: string;
  last_name: string;
  father_name: string;
  province: string;
  destination_country: string;
  photo_url: string;
  registered_at: string;
}

// Default customers (will show 1000 from Google Sheets)
const DEFAULT_CUSTOMERS: Customer[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['احمد', 'فاطمه', 'علی', 'مریم', 'حسن', 'زهرا', 'محمد', 'سارا', 'کمال', 'لیلا'][i % 10],
  last_name: ['کریمی', 'محمدی', 'رضایی', 'حسینی', 'قاسمی', 'احمدی', 'یعقوبی', 'نوری', 'سلیمانی', 'موسوی'][i % 10],
  father_name: ['محمد', 'علی', 'حسن', 'اکرم', 'رحیم', 'مصطفی', 'عبدالله', 'جمال', 'نور', 'خالد'][i % 10],
  province: ['کابل', 'هرات', 'مزار شریف', 'قندهار', 'ننگرهار', 'کندز', 'بامیان', 'پروان', 'غزنی', 'بلخ'][i % 10],
  destination_country: ['آلمان', 'استرالیا', 'ایتالیا', 'سوئیس', 'فرانسه', 'کانادا'][i % 6],
  photo_url: '',
  registered_at: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
}));

const COUNTRY_FLAGS: Record<string, string> = {
  'آلمان': '🇩🇪',
  'استرالیا': '🇦🇺',
  'ایتالیا': '🇮🇹',
  'سوئیس': '🇨🇭',
  'فرانسه': '🇫🇷',
  'کانادا': '🇨🇦',
  'انگلیس': '🇬🇧',
};

export function RegisteredCustomers() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=customers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        } else {
          setCustomers(DEFAULT_CUSTOMERS);
        }
      })
      .catch(() => {
        setCustomers(DEFAULT_CUSTOMERS);
      })
      .finally(() => setLoading(false));
  }, []);

  // Triple the customers for seamless scrolling
  const displayCustomers = customers.length > 0 ? [...customers, ...customers, ...customers] : [];

  return (
    <>
      {/* Trigger Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Users className="w-5 h-5" />
          <span>مراجعین و متقاضیان ثبت شده</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">{customers.length}+</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 justify-center">
                <Users className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">مراجعین و متقاضیان ثبت شده</h2>
                  <p className="text-emerald-100 text-sm">{customers.length}+ مراجع ثبت شده</p>
                </div>
              </div>
            </div>

            {/* Scrolling List */}
            <div className="h-[60vh] overflow-hidden relative">
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />

              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-10 h-10 border-4 border-emerald-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div
                  className="animate-scroll-vertical px-6 py-4 space-y-3"
                  style={{
                    animation: 'scrollCustomers 50s linear infinite',
                    width: 'max-content',
                    minWidth: '100%',
                  }}
                >
                  {displayCustomers.map((c, i) => (
                    <div
                      key={`${c.id}-${i}`}
                      className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors mr-auto"
                      style={{ width: 'calc(100% - 2rem)' }}
                    >
                      {/* Photo or Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                        {c.photo_url ? (
                          <img src={c.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {c.name} {c.last_name}
                          </p>
                          <span className="text-sm">
                            {COUNTRY_FLAGS[c.destination_country] || '🌍'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>پدر: {c.father_name}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>{c.province}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{c.destination_country}</span>
                        </div>
                      </div>

                      {/* Registered Badge */}
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0">
                        ثبت شده
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                لیست به صورت خودکار حرکت می‌کند • {customers.length}+ مراجع
              </p>
            </div>
          </div>

          <style>{`
            @keyframes scrollCustomers {
              0% { transform: translateY(0); }
              100% { transform: translateY(-33.33%); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
