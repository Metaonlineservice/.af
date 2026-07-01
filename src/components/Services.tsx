import React, { useState, useEffect } from 'react';
import { Globe2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SHEETDB_API, SHEET_NAMES, VISA_FORM_TYPES } from '../config/apiConfig';

interface Service {
  id: string;
  title_fa: string;
  description: string;
  price: string;
  icon: string;
  is_active: string;
}

// Default services - mapped to form types
const DEFAULT_SERVICES: (Service & { formId: string })[] = [
  { id: '1', icon: '🇩🇪', title_fa: 'ویزای آلمان', description: 'خدمات کامل برای درخواست ویزای آلمان شامل مشاوره، آماده‌سازی مدارک و پیگیری پرونده', price: 'از ۳,۰۰۰ افغانی', is_active: 'true', formId: 'germany' },
  { id: '2', icon: '🇦🇺', title_fa: 'ویزای استرالیا', description: 'خدمات تخصصی ویزای استرالیا و پرونده‌های پناهندگی با تیم وکلای مجرب', price: 'از ۵,۵۰۰ افغانی', is_active: 'true', formId: 'australia' },
  { id: '3', icon: '🇮🇹', title_fa: 'ویزای ایتالیا', description: 'مشاوره و آماده‌سازی کامل مدارک برای پیوند فامیلی و ویزای ایتالیا', price: 'از ۳,۰۰۰ افغانی', is_active: 'true', formId: 'italy' },
  { id: '4', icon: '🇨🇭', title_fa: 'ویزای سوئیس', description: 'خدمات تخصصی ویزای سوئیس با پشتیبانی در تمام مراحل', price: 'از ۵,۵۰۰ افغانی', is_active: 'true', formId: 'switzerland' },
  { id: '5', icon: '🇫🇷', title_fa: 'ویزای فرانسه', description: 'درخواست ویزای شنگن از طریق سفارت فرانسه با بررسی کامل پرونده', price: 'از ۳,۰۰۰ افغانی', is_active: 'true', formId: 'france' },
  { id: '6', icon: '🇨🇦', title_fa: 'ویزای کانادا', description: 'خدمات مهاجرت به کانادا، پناهندگی و پیوند فامیلی با وکیل اختصاصی', price: 'از ۱۰,۰۰۰ افغانی', is_active: 'true', formId: 'canada' },
];

export function Services() {
  const [services, setServices] = useState<(Service & { formId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=${SHEET_NAMES.SERVICES}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((s: Service) => s.is_active === 'true' || s.is_active === true);
          if (active.length > 0) {
            // Map services to form IDs
            const mappedServices = active.map((s: Service) => {
              const existingForm = VISA_FORM_TYPES.find(f => s.title_fa?.includes(f.titleFa) || s.icon?.includes(f.icon));
              return {
                ...s,
                formId: existingForm?.id || s.id,
              };
            });
            setServices(mappedServices);
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

  const handleServiceClick = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  return (
    <section id="services" className="py-20 bg-corporate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-navy-100 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 rounded-full text-navy-600 dark:text-navy-300 text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">خدمات تخصصی مهاجرتی</h2>
          <p className="text-corporate-500 dark:text-corporate-400 max-w-2xl mx-auto">
            ما در تمام مراحل درخواست ویزا، از مشاوره اولیه تا تأیید نهایی، همراه شما هستیم.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-navy-900 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-corporate-200 dark:bg-navy-800 rounded-xl mb-4" />
                <div className="h-4 bg-corporate-200 dark:bg-navy-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-corporate-200 dark:bg-navy-800 rounded w-full mb-4" />
                <div className="h-4 bg-corporate-200 dark:bg-navy-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleServiceClick(s.formId)}
                className="bg-white dark:bg-navy-900 rounded-2xl shadow-lg border border-corporate-100 dark:border-navy-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-right"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{s.icon}</div>
                  <ArrowLeft className="w-5 h-5 text-corporate-400 group-hover:text-navy-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors">
                  {s.title_fa}
                </h3>
                <p className="text-sm text-corporate-500 dark:text-corporate-400 leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-corporate-100 dark:border-navy-800">
                  <span className="text-navy-600 dark:text-navy-400 font-bold text-sm">{s.price}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">مشاوره رایگان</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
