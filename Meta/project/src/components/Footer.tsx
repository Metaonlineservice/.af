import React from 'react';
import { Mail, MapPin, Phone, ChevronUp } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface FooterProps {
  onEmergencyClick?: () => void;
}

export function Footer({ onEmergencyClick }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-900 text-white overflow-hidden">
      {/* Wave Divider */}
      <div className="relative h-12 overflow-hidden">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path fill="#0f172a" d="M0,48 L0,24 Q180,0 360,24 Q540,48 720,24 Q900,0 1080,24 Q1260,48 1440,24 L1440,48 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Meta Online Service" className="h-10 w-auto brightness-0 invert opacity-90" />
              <div>
                <h3 className="font-bold text-lg">خدمات آنلاین میتا</h3>
                <p className="text-xs text-slate-400">Meta Online Service</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
              مشاوره حقوقی و خدمات مهاجرتی تخصصی برای پرونده‌های پناهندگی، ویزای بشردوستی و پیوند فامیلی در کشورهای اروپایی و استرالیا.
            </p>
            {/* WhatsApp Only */}
            <a
              href="https://wa.me/989012055578"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-4 py-3 bg-emerald-500/10 rounded-xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              <WhatsAppIcon />
              <span className="text-sm font-medium">واتساپ: +989012055578</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-gold-400">دسترسی سریع</h4>
            <ul className="space-y-3">
              {[
                { label: 'صفحه اصلی', href: '/' },
                { label: 'فرم‌های ثبت‌نام', href: '/form/germany' },
                { label: 'خدمات', href: '#services' },
                { label: 'پنل مدیریت', href: '/admin' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-gold-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
              {onEmergencyClick && (
                <li>
                  <button onClick={onEmergencyClick} className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                    تماس اضطراری
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-gold-400">اطلاعات تماس</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">کابل، افغانستان<br />شار-e-Naw، عطف بازار</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+98 901 205 5578</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">immigration.tehran@tuta.io</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} خدمات آنلاین میتا. تمامی حقوق محفوظ است.</p>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm">
              بازگشت به بالا
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
