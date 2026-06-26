import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, FileText } from 'lucide-react';
import { EMBASSY_FORMS, EmbassyFormType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSelect: (formId: EmbassyFormType) => void;
}

export function Sidebar({ isOpen, onClose, onFormSelect }: SidebarProps) {
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

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <div ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">منوی خدمات</h2>
            <p className="text-xs text-slate-500 mt-0.5">فرم‌های عمومی - بدون نیاز به ثبت‌نام</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <img src="/logo.png" alt="Meta Online Service" className="h-8 mx-auto object-contain dark:opacity-80" />
        </div>

        <nav className="flex-1 overflow-y-auto">
          {/* Registration Forms Section */}
          <div className="px-4 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">فرم‌های ثبت‌نام</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              تمام فرم‌ها عمومی هستند و نیاز به ورود ندارند.
            </p>
            <div className="space-y-2">
              {EMBASSY_FORMS.map((form) => (
                <button key={form.id} onClick={() => handleFormSelect(form.id)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right transition-all duration-200 group bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-gold-300 dark:hover:border-gold-700">
                  <span className="text-2xl flex-shrink-0">{form.icon}</span>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{form.titleFa}</p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{form.title}</p>
                  </div>
                  {form.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-400 text-slate-900 rounded-full flex-shrink-0">{form.badge}</span>
                  )}
                  <ChevronLeft className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>واتساپ: +989012055578</span>
            <a href="https://wa.me/989012055578" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              تماس مستقیم
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
