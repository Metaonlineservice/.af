import React, { useState, useEffect } from 'react';
import { Globe2 } from 'lucide-react';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Service {
  id: string;
  title_fa: string;
  description: string;
  price: string;
  icon: string;
  is_active: string;
}

// Default services if Google Sheets unavailable
const DEFAULT_SERVICES: Service[] = [
  { id: '1', icon: '🇩🇪', title_fa: 'ویزای آلمان', description: 'خدمات کامل برای درخواست ویزای آلمان شامل مشاوره، آماده‌سازی مدارک و پیگیری پرونده', price: 'از ۳,۰۰۰ افغانی', is_active: 'true' },
  { id: '2', icon: '🇦🇺', title_fa: 'ویزای استرالیا', description: 'خدمات تخصصی ویزای استرالیا و پرونده‌های پناهندگی با تیم وکلای مجرب', price: 'از ۵,۵۰۰ افغانی', is_active: 'true' },
  { id: '3', icon: '🇮🇹', title_fa: 'ویزای ایتالیا', description: 'مشاوره و آماده‌سازی کامل مدارک برای پیوند فامیلی و ویزای ایتالیا', price: 'از ۳,۰۰۰ افغانی', is_active: 'true' },
  { id: '4', icon: '🇨🇭', title_fa: 'ویزای سوئیس', description: 'خدمات تخصصی ویزای سوئیس با پشتیبانی در تمام مراحل', price: 'از ۵,۵۰۰ افغانی', is_active: 'true' },
  { id: '5', icon: '🇫🇷', title_fa: 'ویزای فرانسه', description: 'درخواست ویزای شنگن از طریق سفارت فرانسه با بررسی کامل پرونده', price: 'از ۳,۰۰۰ افغانی', is_active: 'true' },
  { id: '6', icon: '🇨🇦', title_fa: 'ویزای کانادا', description: 'خدمات مهاجرت به کانادا، پناهندگی و پیوند فامیلی با وکیل اختصاصی', price: 'از ۱۰,۰۰۰ افغانی', is_active: 'true' },
];

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=services`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((s: Service) => s.is_active === 'true' || s.is_active === true);
          if (active.length > 0) {
            setServices(active);
          } else {
            setServices(DEFAULT_SERVICES);
          }
        } else {
          setServices(DEFAULT_SERVICES);
        }
      })
      .catch(() => {
        setServices(DEFAULT_SERVICES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-600 dark:text-gold-400 text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">خدمات تخصصی مهاجرتی</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            ما در تمام مراحل درخواست ویزا، از مشاوره اولیه تا تأیید نهایی، همراه شما هستیم.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow_border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">
                  {s.title_fa}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-gold-500 font-bold text-sm">{s.price}</span>
                  <span className="text-xs text-slate-400">مشاوره رایگان</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
