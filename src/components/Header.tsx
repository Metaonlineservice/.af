import React, { useState } from 'react';
import { Menu, Moon, Sun, Shield, AlertTriangle, ChevronDown, Globe, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.439 1.441 1.439c.795 0 1.439-.644 1.439-1.439s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface HeaderProps {
  onMenuClick: () => void;
  onEmergencyClick: () => void;
  onAppointmentClick: () => void;
}

const LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇦🇫' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

export function Header({ onMenuClick, onEmergencyClick, onAppointmentClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-corporate-200 dark:border-navy-800/70 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="Meta Online Service" className="h-8 w-auto object-contain drop-shadow-sm" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-navy-900 dark:text-white leading-tight">{t('siteName')}</h1>
              <p className="text-[10px] text-corporate-500 leading-tight">Meta Online Service</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61591311924456"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-navy-800/50 transition-all duration-300 hover:scale-110"
              title="Facebook"
            >
              <FacebookIcon />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/meta_online_service/#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-pink-500 hover:bg-pink-50 dark:hover:bg-navy-800/50 transition-all duration-300 hover:scale-110"
              title="Instagram"
            >
              <InstagramIcon />
            </a>

            {/* WhatsApp - animated */}
            <a
              href="https://wa.me/989012055578"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-navy-800/50 transition-all animate-zoom-pulse"
              title="واتساپ"
            >
              <WhatsAppIcon />
            </a>

            {/* Emergency button */}
            <button
              onClick={onEmergencyClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all shadow animate-bounce-slow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('emergency')}</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 p-2 rounded-lg text-navy-600 dark:text-corporate-400 hover:bg-corporate-100 dark:hover:bg-navy-800 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === language)?.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-navy-900 rounded-xl shadow-xl border border-corporate-200 dark:border-navy-700 overflow-hidden min-w-[140px] animate-slide-down">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-corporate-100 dark:hover:bg-navy-800 transition-colors ${language === lang.code ? 'bg-corporate-50 dark:bg-navy-800/50' : ''}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1 text-navy-700 dark:text-corporate-200">{lang.nativeName}</span>
                      {language === lang.code && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-navy-600 dark:text-corporate-400 hover:bg-corporate-100 dark:hover:bg-navy-800 transition-all"
              title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin link - with green online indicator */}
            <a
              href="/admin"
              className="relative flex items-center gap-1.5 px-3 py-1.5 border border-corporate-300 dark:border-navy-600 hover:bg-corporate-100 dark:hover:bg-navy-800 text-navy-700 dark:text-corporate-300 text-sm font-semibold rounded-lg transition-all"
            >
              {/* Green online indicator */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin')}</span>
            </a>

            {/* Menu */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-corporate-100 dark:bg-navy-800 text-navy-700 dark:text-corporate-300 hover:bg-corporate-200 dark:hover:bg-navy-700 transition-all group"
            >
              <Menu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close language dropdown */}
      {langDropdownOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setLangDropdownOpen(false)} />
      )}
    </header>
  );
}
