import React, { useState, useEffect } from 'react';
import { Clock, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface InProcessCase {
  id: string;
  name: string;
  last_name: string;
  father_name: string;
  province: string;
  destination_country: string;
  photo_url: string;
  status: string;
}

// Default in-process cases (38 cases)
const DEFAULT_CASES: InProcessCase[] = [
  { id: '1', name: 'احمد', last_name: 'سلیمانی', father_name: 'محمد', province: 'کابل', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '2', name: 'فاطمه', last_name: 'یعقوبی', father_name: 'علی', province: 'هرات', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '3', name: 'علی', last_name: 'موسوی', father_name: 'حسن', province: 'مزار شریف', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '4', name: 'مریم', last_name: 'هادی', father_name: 'اکرم', province: 'کابل', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '5', name: 'حسن', last_name: 'نوری', father_name: 'رحیم', province: 'قندهار', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '6', name: 'زهرا', last_name: 'صادقی', father_name: 'مصطفی', province: 'هرات', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '7', name: 'محمد', last_name: 'رحیمی', father_name: 'عبدالله', province: 'کابل', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '8', name: 'سارا', last_name: 'کمالی', father_name: 'جمال', province: 'مزار', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '9', name: 'کمال', last_name: 'احمدی', father_name: 'نور', province: 'ننگرهار', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '10', name: 'لیلا', last_name: 'حسینی', father_name: 'خالد', province: 'کابل', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '11', name: 'رضا', last_name: 'عظیمی', father_name: 'سعید', province: 'بلخ', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '12', name: 'ناهید', last_name: 'بیگی', father_name: 'فرید', province: 'هرات', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '13', name: 'واحد', last_name: 'علیزاده', father_name: 'غلام', province: 'قندهار', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '14', name: 'شکیبا', last_name: 'مالکی', father_name: 'عارف', province: 'کابل', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '15', name: 'جاوید', last_name: 'زارع', father_name: 'رشید', province: 'کندز', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '16', name: 'فرنگیس', last_name: 'غفوری', father_name: 'شیر', province: 'بامیان', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '17', name: 'طارق', last_name: 'شریفی', father_name: 'دلیر', province: 'کابل', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '18', name: 'معصومه', last_name: 'میرزایی', father_name: 'بهادر', province: 'هرات', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '19', name: 'فرهاد', last_name: 'اکبری', father_name: 'صفر', province: 'ننگرهار', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '20', name: 'سمیرا', last_name: 'نادری', father_name: 'تیمور', province: 'کابل', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '21', name: 'بهرام', last_name: 'صابر', father_name: 'جابر', province: 'پروان', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '22', name: 'زیبا', last_name: 'قاسمی', father_name: 'امین', province: 'غزنی', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '23', name: 'هماyon', last_name: 'احمدزی', father_name: 'عزیز', province: 'کابل', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '24', name: 'فریبا', last_name: 'محمدی', father_name: 'کریم', province: 'هرات', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '25', name: 'امین', last_name: 'حیدری', father_name: 'محمود', province: 'مزار', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '26', name: 'شبنم', last_name: 'کوهستانی', father_name: 'هادی', province: 'کابل', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '27', name: 'دلارام', last_name: 'جعفری', father_name: 'نور', province: 'بامیان', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '28', name: 'صادق', last_name: 'عرفانی', father_name: 'رحمان', province: 'ننگرهار', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '29', name: 'طاهره', last_name: 'خسروی', father_name: 'اسد', province: 'هرات', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '30', name: 'مجید', last_name: 'مهدوی', father_name: 'جلال', province: 'کابل', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '31', name: 'لاله', last_name: 'فرهادی', father_name: 'جمشید', province: 'غزنی', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '32', name: 'آرش', last_name: 'عبدلی', father_name: 'پرویز', province: 'کندز', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
  { id: '33', name: 'رویا', last_name: 'سلیمانی', father_name: 'فریاد', province: 'کابل', destination_country: 'ایتالیا', photo_url: '', status: 'pending' },
  { id: '34', name: 'نادر', last_name: 'موسوی', father_name: 'صمد', province: 'قندهار', destination_country: 'فرانسه', photo_url: '', status: 'pending' },
  { id: '35', name: 'نرگس', last_name: 'بیاتی', father_name: 'کامران', province: 'هرات', destination_country: 'کانادا', photo_url: '', status: 'pending' },
  { id: '36', name: 'آتنا', last_name: 'رضایی', father_name: 'سرور', province: 'کابل', destination_country: 'سوئیس', photo_url: '', status: 'pending' },
  { id: '37', name: 'شهاب', last_name: 'صادقی', father_name: 'ناصر', province: 'ننگرهار', destination_country: 'آلمان', photo_url: '', status: 'pending' },
  { id: '38', name: 'مینا', last_name: 'هادی', father_name: 'رسول', province: 'بامیان', destination_country: 'استرالیا', photo_url: '', status: 'pending' },
];

const COUNTRY_FLAGS: Record<string, string> = {
  'آلمان': '🇩🇪',
  'استرالیا': '🇦🇺',
  'ایتالیا': '🇮🇹',
  'سوئیس': '🇨🇭',
  'فرانسه': '🇫🇷',
  'کانادا': '🇨🇦',
  'انگلیس': '🇬🇧',
};

export function InProcessCases() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [cases, setCases] = useState<InProcessCase[]>([]);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=inprocess_cases`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const pending = data.filter((c: InProcessCase) => c.status === 'pending' || c.status === 'درحال بررسی');
          if (pending.length > 0) {
            setCases(pending);
          } else {
            setCases(DEFAULT_CASES);
          }
        } else {
          setCases(DEFAULT_CASES);
        }
      })
      .catch(() => {
        setCases(DEFAULT_CASES);
      });
  }, []);

  // Triple the cases for seamless scrolling
  const displayCases = cases.length > 0 ? [...cases, ...cases, ...cases] : [];

  return (
    <>
      {/* Trigger Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Clock className="w-5 h-5" />
          <span>پرونده تحت پروسس</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">{cases.length}</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 justify-center">
                <Clock className="w-8 h-8 animate-pulse" />
                <div>
                  <h2 className="text-2xl font-bold">پرونده تحت پروسس</h2>
                  <p className="text-blue-100 text-sm">{cases.length} پرونده در حال بررسی</p>
                </div>
              </div>
            </div>

            {/* Scrolling List */}
            <div className="h-[60vh] overflow-hidden relative">
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />

              <div
                className="animate-scroll-vertical px-6 py-4 space-y-3"
                style={{
                  animation: 'scrollVertical 35s linear infinite',
                }}
              >
                {displayCases.map((c, i) => (
                  <div
                    key={`${c.id}-${i}`}
                    className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    {/* Photo or Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
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
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{c.destination_country}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      در حال بررسی
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                لیست به صورت خودکار حرکت می‌کند
              </p>
            </div>
          </div>

          <style>{`
            @keyframes scrollVertical {
              0% { transform: translateY(0); }
              100% { transform: translateY(-33.33%); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
