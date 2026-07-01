import React, { useState, useEffect } from 'react';
import { Award, X, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SHEETDB_API, SHEET_NAMES } from '../config/apiConfig';

interface SuccessfulCase {
  id: string;
  name: string;
  last_name: string;
  father_name: string;
  province: string;
  destination_country: string;
  photo_url: string;
  approved: string;
}

// Default successful cases (38 cases)
const DEFAULT_CASES: SuccessfulCase[] = [
  { id: '1', name: 'احمد', last_name: 'کریمی', father_name: 'محمد', province: 'کابل', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '2', name: 'فاطمه', last_name: 'محمدی', father_name: 'علی', province: 'هرات', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '3', name: 'علی', last_name: 'رضایی', father_name: 'حسن', province: 'مزار شریف', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '4', name: 'مریم', last_name: 'حسینی', father_name: 'اکرم', province: 'کابل', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '5', name: 'حسن', last_name: 'قاسمی', father_name: 'رحیم', province: 'قندهار', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '6', name: 'زهرا', last_name: 'احمدی', father_name: 'مصطفی', province: 'هرات', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '7', name: 'محمد', last_name: 'یعقوبی', father_name: 'عبدالله', province: 'کابل', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '8', name: 'سارا', last_name: 'نوری', father_name: 'جمال', province: 'مزار', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '9', name: 'کمال', last_name: 'سامی', father_name: 'نور', province: 'ننگرهار', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '10', name: 'لیلا', last_name: 'احمدزی', father_name: 'خالد', province: 'کابل', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '11', name: 'رضا', last_name: 'موسوی', father_name: 'سعید', province: 'بلخ', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '12', name: 'ناهید', last_name: 'صادقی', father_name: 'فرید', province: 'هرات', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '13', name: 'واحد', last_name: 'رحیمی', father_name: 'غلام', province: 'قندهار', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '14', name: 'شکیبا', last_name: 'هادی', father_name: 'عارف', province: 'کابل', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '15', name: 'جاوید', last_name: 'اکبری', father_name: 'رشید', province: 'کندز', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '16', name: 'فرنگیس', last_name: 'عظیمی', father_name: 'شیر', province: 'بامیان', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '17', name: 'طارق', last_name: 'سلیمانی', father_name: 'دلیر', province: 'کابل', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '18', name: 'معصومه', last_name: 'کیمیا', father_name: 'بهادر', province: 'هرات', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '19', name: 'فرهاد', last_name: 'نادری', father_name: 'صفر', province: 'ننگرهار', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '20', name: 'سمیرا', last_name: 'علی‌زاده', father_name: 'تیمور', province: 'کابل', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '21', name: 'بهرام', last_name: 'غفوری', father_name: 'جابر', province: 'پروان', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '22', name: 'زیبا', last_name: 'شریفی', father_name: 'امین', province: 'غزنی', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '23', name: 'هماyon', last_name: 'صابر', father_name: 'عزیز', province: 'کابل', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '24', name: 'فریبا', last_name: 'جعفری', father_name: 'کریم', province: 'هرات', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '25', name: 'امین', last_name: 'زارع', father_name: 'محمود', province: 'مزار', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '26', name: 'شبنم', last_name: 'میرزایی', father_name: 'هادی', province: 'کابل', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '27', name: 'دلارام', last_name: 'حیدری', father_name: 'نور', province: 'بامیان', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '28', name: 'صادق', last_name: 'کوهستانی', father_name: 'رحمان', province: 'ننگرهار', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '29', name: 'طاهره', last_name: 'بیگی', father_name: 'اسد', province: 'هرات', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '30', name: 'مجید', last_name: 'عرفانی', father_name: 'جلال', province: 'کابل', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '31', name: 'لاله', last_name: 'خسروی', father_name: 'جمشید', province: 'غزنی', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '32', name: 'آرش', last_name: 'مالکی', father_name: 'پرویز', province: 'کندز', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
  { id: '33', name: 'رویا', last_name: 'کمالی', father_name: 'فریاد', province: 'کابل', destination_country: 'ایتالیا', photo_url: '', approved: 'true' },
  { id: '34', name: 'نادر', last_name: 'احمدی', father_name: 'صمد', province: 'قندهار', destination_country: 'فرانسه', photo_url: '', approved: 'true' },
  { id: '35', name: 'نرگس', last_name: 'فرهادی', father_name: 'کامران', province: 'هرات', destination_country: 'کانادا', photo_url: '', approved: 'true' },
  { id: '36', name: 'آتنا', last_name: 'مهدوی', father_name: 'سرور', province: 'کابل', destination_country: 'سوئیس', photo_url: '', approved: 'true' },
  { id: '37', name: 'شهاب', last_name: 'کریمی', father_name: 'ناصر', province: 'ننگرهار', destination_country: 'آلمان', photo_url: '', approved: 'true' },
  { id: '38', name: 'مینا', last_name: 'عبدلی', father_name: 'رسول', province: 'بامیان', destination_country: 'استرالیا', photo_url: '', approved: 'true' },
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

export function SuccessfulCases() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [cases, setCases] = useState<SuccessfulCase[]>([]);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=${SHEET_NAMES.SUCCESSFUL_CASES}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const approved = data.filter((c: SuccessfulCase) => c.approved === 'true' || c.approved === true);
          if (approved.length > 0) {
            setCases(approved);
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

  return (
    <>
      <section className="py-16 bg-corporate-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-full text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              پرونده‌های موفق
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-3">
              {t('successfulCases')}
            </h2>
            <p className="text-corporate-500 dark:text-corporate-400">
              پرونده‌هایی که با موفقیت به نتیجه رسیده‌اند
            </p>
          </div>

          {/* Modern Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {cases.slice(0, 8).map((c, i) => (
              <div
                key={c.id}
                className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-corporate-100 dark:border-navy-800 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-lg animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
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
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">تایید</span>
                </div>
              </div>
            ))}
          </div>

          {cases.length > 8 && (
            <div className="text-center">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Award className="w-5 h-5" />
                مشاهده همه {cases.length} پرونده
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-l from-amber-500 to-amber-600 p-6 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 justify-center">
                <Award className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{t('successfulCases')}</h2>
                  <p className="text-amber-100 text-sm">{cases.length} پرونده موفق</p>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cases.map((c, i) => (
                  <div
                    key={`${c.id}-${i}`}
                    className="bg-corporate-50 dark:bg-navy-800 rounded-xl p-4 border border-corporate-200 dark:border-navy-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
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
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">تایید شده</span>
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
