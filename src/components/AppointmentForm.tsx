import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Loader2, Save, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SHEETDB_API, SHEET_NAMES, PROVINCES, COUNTRIES, TIME_SLOTS, getApiUrl } from '../config/apiConfig';
import { FormNotice } from './FormNotice';
import { generateApplicationPDF } from '../utils/pdfGenerator';

interface FormData {
  name: string;
  lastName: string;
  fatherName: string;
  phone: string;
  email: string;
  province: string;
  destination_country: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
}

const DEFAULT_FORM_DATA: FormData = {
  name: '',
  lastName: '',
  fatherName: '',
  phone: '',
  email: '',
  province: '',
  destination_country: '',
  preferred_date: '',
  preferred_time: '',
  message: '',
};

export function AppointmentForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('appointment_form');
    return saved ? JSON.parse(saved) : DEFAULT_FORM_DATA;
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('appointment_form');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name || parsed.phone) {
        setShowSavedMsg(true);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveDraft = () => {
    localStorage.setItem('appointment_form', JSON.stringify(formData));
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const loadDraft = () => {
    const saved = localStorage.getItem('appointment_form');
    if (saved) {
      setFormData(JSON.parse(saved));
      setShowSavedMsg(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('appointment_form');
    setFormData(DEFAULT_FORM_DATA);
    setShowSavedMsg(false);
  };

  const handleDownloadPDF = () => {
    if (submittedData) {
      generateApplicationPDF(submittedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentId = 'APT-' + Date.now().toString(36).toUpperCase();
      const appointmentData = {
        ...formData,
        id: appointmentId,
        status: 'pending',
        created_at: new Date().toISOString(),
        formType: 'appointment',
      };

      // Save to Google Sheets via SheetDB
      const response = await fetch(`${getApiUrl()}?sheet=${SHEET_NAMES.APPOINTMENTS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [appointmentData]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SheetDB error:', response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Appointment saved:', result);

      // Store data for PDF download - only after confirmed save
      setSubmittedData(appointmentData);
      localStorage.removeItem('appointment_form');
      setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-corporate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">{t('formSubmitted')}</h2>
          <p className="text-corporate-600 dark:text-corporate-400 mb-6">
            قرار ملاقات شما با موفقیت ثبت شد. تیم ما به زودی با شما تماس خواهند گرفت.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6">
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              شماره پیگیری: {submittedData?.id || Date.now().toString().slice(-8)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl animate-pulse-soft"
            >
              <Download className="w-5 h-5" />
              دانلود PDF
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-xl transition-all"
            >
              بازگشت به صفحه اصلی
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-50 to-corporate-100 dark:from-navy-950 dark:to-navy-900 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">{t('bookAppointment')}</h1>
          <p className="text-corporate-600 dark:text-corporate-400">
            برای دریافت وقت ملاقات، فرم زیر را تکمیل کنید
          </p>
        </div>

        {/* Form Notice */}
        <div className="mb-6">
          <FormNotice />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-3xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Saved Draft Notification */}
          {showSavedMsg && (
            <div className="flex items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Save className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">اطلاعات ذخیره شده قبلی موجود است</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">آیا می‌خواهید ادامه دهید؟</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={loadDraft} className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  ادامه
                </button>
                <button type="button" onClick={clearDraft} className="px-3 py-1.5 bg-corporate-200 dark:bg-navy-700 text-corporate-700 dark:text-corporate-300 text-sm rounded-lg hover:bg-corporate-300 dark:hover:bg-navy-600 transition-colors">
                  شروع جدید
                </button>
              </div>
            </div>
          )}

          {/* Saved Notification */}
          {showSavedNotification && (
            <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-down">
              <Save className="w-5 h-5" />
              <span className="font-medium">اطلاعات ذخیره شد</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <User className="w-4 h-4 inline ml-1" />
                {t('name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                placeholder="نام"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                {t('lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                placeholder="نام خانوادگی"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                {t('fatherName')}
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                placeholder="نام پدر"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <MapPin className="w-4 h-4 inline ml-1" />
                {t('province')}
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              >
                <option value="">انتخاب ولایت</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <Phone className="w-4 h-4 inline ml-1" />
                {t('phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                placeholder="07XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <Mail className="w-4 h-4 inline ml-1" />
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                placeholder="example@email.com"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
              {t('destination')}
            </label>
            <select
              name="destination_country"
              value={formData.destination_country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
            >
              <option value="">انتخاب کشور</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <Calendar className="w-4 h-4 inline ml-1" />
                {t('date')}
              </label>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
                <Clock className="w-4 h-4 inline ml-1" />
                {t('time')}
              </label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              >
                <option value="">انتخاب ساعت</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-corporate-700 dark:text-corporate-300 mb-2">
              {t('message')} (اختیاری)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-corporate-50 dark:bg-navy-800 border border-corporate-200 dark:border-navy-700 rounded-xl text-navy-900 dark:text-white focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all resize-none"
              placeholder="پیام یا توضیحات اضافی..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  {t('submit')}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="flex-1 sm:flex-none bg-corporate-100 dark:bg-navy-800 hover:bg-corporate-200 dark:hover:bg-navy-700 text-corporate-700 dark:text-corporate-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-corporate-300 dark:border-navy-600"
            >
              <Save className="w-5 h-5" />
              ذخیره و ادامه بعدی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
