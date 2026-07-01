import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, FileText, Calendar, Award, Home, Shield, Clock, Users } from 'lucide-react';
import { EMBASSY_FORMS, EmbassyFormType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSelect: (formId: EmbassyFormType) => void;
  onAppointmentClick: () => void;
}

export function Sidebar({ isOpen, onClose, onFormSelect, onAppointmentClick }: SidebarProps) {
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleFormSelect = (formId: EmbassyFormType) => {
    onFormSelect(formId);
    onClose();
  };

  const handleAppointmentClick = () => {
    onAppointmentClick();
    onClose();
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar with slide and scale animation */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col transform transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        style={{
          boxShadow: isOpen ? '-20px 0 60px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-l from-gold-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent" />
          <div className="relative">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">{t('services')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">فرم‌های عمومی - بدون نیاز به ثبت‌نام</p>
          </div>
          <button
            onClick={onClose}
            className="relative p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-all duration-300 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <img src="/logo.png" alt="Meta Online Service" className="h-8 mx-auto object-contain dark:opacity-80" />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">دسترسی سریع</p>
            </div>
            <div className="space-y-2">
              {/* Multi-Step Form */}
              <a
                href="/multiform"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-300 group bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800 hover:from-purple-100 hover:to-purple-50 dark:hover:from-purple-900/30 dark:hover:to-purple-900/10 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700"
              >
                <span className="text-2xl flex-shrink-0 bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm text-purple-700 dark:text-purple-400">فرم درخواست</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">فرم چند مرحله‌ای</p>
                </div>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 text-purple-400 group-hover:-translate-x-1 transition-transform" />
              </a>

              {/* Appointment Button */}
              <button
                onClick={handleAppointmentClick}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-300 group bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 hover:from-emerald-100 hover:to-emerald-50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <span className="text-2xl flex-shrink-0 bg-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">{t('appointment')}</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{t('bookAppointment')}</p>
                </div>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Successful Cases */}
              <a
                href="#successful-cases"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-300 group bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 hover:from-amber-100 hover:to-amber-50 dark:hover:from-amber-900/30 dark:hover:to-amber-900/10 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700"
              >
                <span className="text-2xl flex-shrink-0 bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm text-amber-700 dark:text-amber-400">{t('successfulCases')}</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">۳۸+ پرونده موفق</p>
                </div>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              </a>

              {/* In-Process Cases */}
              <a
                href="#inprocess-cases"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-300 group bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 hover:from-blue-100 hover:to-blue-50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/10 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <span className="text-2xl flex-shrink-0 bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm text-blue-700 dark:text-blue-400">پرونده تحت پروسس</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">۳۸ پرونده در حال بررسی</p>
                </div>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 text-blue-400 group-hover:-translate-x-1 transition-transform" />
              </a>

              {/* Registered Customers */}
              <a
                href="#registered-customers"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-300 group bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 hover:from-emerald-100 hover:to-emerald-50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <span className="text-2xl flex-shrink-0 bg-teal-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm text-teal-700 dark:text-teal-400">مراجعین ثبت شده</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">۱۰۰۰+ مراجع</p>
                </div>
                <ChevronLeft className="w-4 h-4 flex-shrink-0 text-teal-400 group-hover:-translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Registration Forms Section */}
          <div className="px-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('forms')}</p>
            </div>
            <div className="space-y-2">
              {EMBASSY_FORMS.map((form, index) => (
                <button
                  key={form.id}
                  onClick={() => handleFormSelect(form.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all duration-300 group bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-gold-300 dark:hover:border-gold-700"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                  }}
                >
                  <span className="text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{form.icon}</span>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{form.titleFa}</p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{form.title}</p>
                  </div>
                  {form.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-400 text-slate-900 rounded-full flex-shrink-0">{form.badge}</span>
                  )}
                  <ChevronLeft className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:-translate-x-1 group-hover:text-gold-500 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <a
            href="/admin"
            className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all mb-3"
          >
            <Shield className="w-5 h-5 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">{t('admin')}</span>
          </a>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>واتساپ: +93730556547</span>
            <a href="https://wa.me/93730556547" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              تماس مستقیم
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
