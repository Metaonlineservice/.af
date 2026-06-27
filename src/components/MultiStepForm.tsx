import React, { useState, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import {
  X,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  User,
  Phone,
  FileText,
  Eye,
  Clock,
} from 'lucide-react';
import { EMAILJS_CONFIG, SHEETDB_API, FORM_STORAGE_KEY, FORM_STEPS, FORM_FIELDS } from '../config/formConfig';

interface FormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

const STORAGE_KEY = FORM_STORAGE_KEY;
const AUTO_SAVE_DELAY = 2000; // Auto-save after 2 seconds of inactivity

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData && Object.keys(parsed.formData).some(k => parsed.formData[k])) {
          setHasDraft(true);
          setFormData(parsed.formData);
          setCurrentStep(parsed.currentStep || 0);
        }
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).some(k => formData[k])) {
        saveDraft(false);
      }
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const saveDraft = useCallback((showNotification = true) => {
    const dataToSave = {
      formData,
      currentStep,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    if (showNotification) {
      setShowSavedNotification(true);
      setTimeout(() => setShowSavedNotification(false), 3000);
    }
    setHasDraft(true);
  }, [formData, currentStep]);

  const loadDraft = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || {});
        setCurrentStep(parsed.currentStep || 0);
        setHasDraft(true);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({});
    setCurrentStep(0);
    setErrors({});
    setTouched(new Set());
    setHasDraft(false);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => new Set(prev).add(name));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name: string, value: string, required: boolean): string => {
    if (required && !value.trim()) {
      return 'این فیلد الزامی است';
    }
    if (name === 'email' && value && !value.includes('@')) {
      return 'ایمیل معتبر نیست';
    }
    if (name === 'phone' && value && !/^[0-9+]+$/.test(value.replace(/\s/g, ''))) {
      return 'شماره تماس معتبر نیست';
    }
    return '';
  };

  const validateStep = (stepIndex: number): boolean => {
    const stepId = FORM_STEPS[stepIndex].id;
    const stepFields = FORM_FIELDS[stepId as keyof typeof FORM_FIELDS] || [];
    const newErrors: FormErrors = {};
    let isValid = true;

    stepFields.forEach(field => {
      const error = validateField(field.name, formData[field.name] || '', field.required);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const validateAll = (): boolean => {
    let isValid = true;
    Object.keys(FORM_FIELDS).forEach(stepId => {
      FORM_FIELDS[stepId as keyof typeof FORM_FIELDS].forEach(field => {
        const error = validateField(field.name, formData[field.name] || '', field.required);
        if (error) {
          setErrors(prev => ({ ...prev, [field.name]: error }));
          isValid = false;
        }
      });
    });
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setLoading(true);

    try {
      // Prepare form data with metadata
      const submissionData = {
        id: `FRM-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        ...formData,
      };

      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          ...submissionData,
          form_id: submissionData.id,
          submit_date: new Date().toLocaleDateString('fa-IR'),
        },
        EMAILJS_CONFIG.publicKey
      );

      // Store in Google Sheets via SheetDB
      await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [submissionData],
        }),
      });

      // Clear draft and show success
      clearDraft();
      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('خطا در ارسال فرم. لطفاً دوباره تلاش کنید.');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (Object.keys(formData).some(k => formData[k])) {
      setShowConfirmClose(true);
    } else {
      clearDraft();
      window.history.back();
    }
  };

  const confirmClose = (saveBeforeClose: boolean) => {
    if (saveBeforeClose) {
      saveDraft(false);
    }
    setShowConfirmClose(false);
    window.history.back();
  };

  // Success state
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">فرم با موفقیت ارسال شد!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            اطلاعات شما ذخیره و ایمیلمان ارسال شد. تیم ما به زودی با شما تماس خواهد گرفت.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6">
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              شماره پیگیری: {`FRM-${Date.now().toString(36).toUpperCase()}`}
            </p>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all">
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    );
  }

  const currentStepId = FORM_STEPS[currentStep].id;
  const currentFields = FORM_FIELDS[currentStepId as keyof typeof FORM_FIELDS] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-6 px-4" dir="rtl">
      {/* Saved Notification */}
      {showSavedNotification && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-down">
          <Save className="w-5 h-5" />
          <span className="font-medium">اطلاعات ذخیره شد</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-l from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">فرم درخواست خدمات</h1>
                <p className="text-blue-100 text-sm mt-1">فرم چند مرحله‌ای با ذخیره خودکار</p>
              </div>
              <button onClick={handleClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => index < currentStep || validateStep(currentStep) ? setCurrentStep(index) : null}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      index === currentStep
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : index < currentStep
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className={`text-2xl ${index <= currentStep ? '' : 'opacity-50'}`}>{step.icon}</span>
                    <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  </button>
                  {index < FORM_STEPS.length - 1 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full ${index < currentStep ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">{FORM_STEPS[currentStep].icon}</span>
            {FORM_STEPS[currentStep].title}
          </h2>

          {currentStep < FORM_STEPS.length - 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentFields.map(field => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors[field.name] ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <option value="">انتخاب کنید</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      placeholder={field.label}
                      rows={3}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors[field.name] ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                      }`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      placeholder={field.label}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors[field.name] ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                      }`}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Review Step */
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4">لطفاً اطلاعات خود را بررسی کنید:</p>
              {Object.keys(FORM_FIELDS).map(stepId => (
                <div key={stepId} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">{FORM_STEPS.find(s => s.id === stepId)?.icon}</span>
                    {FORM_STEPS.find(s => s.id === stepId)?.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {FORM_FIELDS[stepId as keyof typeof FORM_FIELDS].map(field => (
                      <div key={field.name}>
                        <p className="text-slate-500 dark:text-slate-400">{field.label}:</p>
                        <p className="font-medium text-slate-900 dark:text-white">{formData[field.name] || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
            بستن
          </button>

          {/* Save Button */}
          <button
            onClick={() => saveDraft(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all border border-amber-300 dark:border-amber-700"
          >
            <Save className="w-5 h-5" />
            ذخیره و ادامه بعدی
          </button>

          {/* Navigation / Submit Buttons */}
          <div className="flex-1 flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
                قبلی
              </button>
            )}

            {currentStep < FORM_STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
              >
                بعدی
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ارسال فرم
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="text-center mt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          ذخیره خودکار فعال است
        </div>
      </div>

      {/* Confirm Close Modal */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">بستن فرم؟</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              آیا می‌خواهید تغییرات را قبل از بستن ذخیره کنید؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => confirmClose(true)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
              >
                ذخیره و بستن
              </button>
              <button
                onClick={() => confirmClose(false)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                بدون ذخیره
              </button>
              <button
                onClick={() => setShowConfirmClose(false)}
                className="py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
