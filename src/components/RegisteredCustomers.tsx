import React, { useState, useEffect } from 'react';
import { Users, X, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SHEETDB_API, SHEET_NAMES } from '../config/apiConfig';

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
    fetch(`${SHEETDB_API}?sheet=${SHEET_NAMES.CUSTOMERS}`)
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

  return (
    <>
      <section className="py-16 bg-corporate-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              مراجعین و متقاضیان
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-3">
              مراجعین ثبت شده
            </h2>
            <p className="text-corporate-500 dark:text-corporate-400">
              افرادی که در سیستم ثبت نام کرده‌اند
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Modern Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {customers.slice(0, 8).map((c, i) => (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-corporate-100 dark:border-navy-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {c.photo_url ? (
                          <img src={c.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy-900 dark:text-white text-sm truncate">
                          {c.name} {c.last_name}
                        </p>
                        <p className="text-xs text-corporate-500 dark:text-corporate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.province}
                        </p>
                      </div>
                      <span className="text-2xl">{COUNTRY_FLAGS[c.destination_country] || '🌍'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-corporate-100 dark:border-navy-800">
                      <span className="text-xs text-navy-600 dark:text-navy-400 font-medium">{c.destination_country}</span>
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">ثبت شده</span>
                    </div>
                  </div>
                ))}
              </div>

              {customers.length > 8 && (
                <div className="text-center">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="w-5 h-5" />
                    مشاهده همه {customers.length}+ مراجع
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-l from-emerald-500 to-teal-600 p-6 text-white">
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

            {/* Grid */}
            <div className="h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {customers.map((c, i) => (
                  <div
                    key={`${c.id}-${i}`}
                    className="bg-corporate-50 dark:bg-navy-800 rounded-xl p-4 border border-corporate-200 dark:border-navy-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {c.photo_url ? (
                          <img src={c.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy-900 dark:text-white text-sm truncate">
                          {c.name} {c.last_name}
                        </p>
                        <p className="text-xs text-corporate-500 dark:text-corporate-400">پدر: {c.father_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-corporate-600 dark:text-corporate-400">{c.province}</span>
                      <span className="text-lg">{COUNTRY_FLAGS[c.destination_country] || '🌍'}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-corporate-200 dark:border-navy-700 flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-700 dark:text-navy-300">{c.destination_country}</span>
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">ثبت شده</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
