import React, { useState, useEffect } from 'react';
import { X, Send, Check, AlertCircle, User, Phone, Mail, FileText, MapPin, Calendar, Users, Hash, Save, RotateCcw } from 'lucide-react';
import { EmbassyFormType, EMBASSY_FORMS } from '../types';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface VisaFormData {
  firstName: string;
  lastName: string;
  fatherName: string;
  caseType: 'individual' | 'family' | '';
  familyCount: number;
  passportNumber: string;
  dateOfBirth: string;
  sonsCount: number;
  daughtersCount: number;
  country: string;
  province: string;
  whatsappNumber: string;
  emergencyContact: string;
  email: string;
  q1SecurityProblems: 'yes' | 'no' | '';
  q2PriorFilings: 'yes' | 'no' | '';
  q3ProofFiles: 'yes' | 'no' | '';
  q4TransitBudget: 'yes' | 'no' | '';
  q5PassportValidity: 'yes' | 'no' | '';
  awarenessSource: string[];
  legalDocs: string[];
}

interface VisaFormProps {
  formType: EmbassyFormType;
}

const COUNTRIES = ['افغانستان', 'ایران', 'پاکستان', 'سایر'];
const AWARENESS_OPTIONS = ['واتساپ', 'فیسبوک', 'اینستاگرام', 'معرفی دوست', 'سایر'];
const LEGAL_DOCS_OPTIONS = ['پاسپورت', 'تذکره', 'حکم دادگاه', 'مدرک کار', 'سایر'];

const DEFAULT_FORM_DATA: VisaFormData = {
  firstName: '', lastName: '', fatherName: '', caseType: '',
  familyCount: 1, passportNumber: '', dateOfBirth: '',
  sonsCount: 0, daughtersCount: 0, country: 'افغانستان',
  province: '', whatsappNumber: '', emergencyContact: '',
  email: '', q1SecurityProblems: '', q2PriorFilings: '',
  q3ProofFiles: '', q4TransitBudget: '', q5PassportValidity: '',
  awarenessSource: [], legalDocs: [],
};

export function VisaForm({ formType }: VisaFormProps) {
  const form = EMBASSY_FORMS.find(f => f.id === formType);
  const [formData, setFormData] = useState<VisaFormData>(() => {
    const saved = localStorage.getItem(`visa_form_${formType}`);
    return saved ? JSON.parse(saved) : DEFAULT_FORM_DATA;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  // Check for saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(`visa_form_${formType}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.firstName || parsed.lastName || parsed.email) {
        setShowSavedMsg(true);
      }
    }
  }, [formType]);

  const update = (k: keyof VisaFormData, v: any) => {
    setFormData(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const toggleArray = (field: 'awarenessSource' | 'legalDocs', value: string) => {
    const arr = formData[field] as string[];
    const newArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    update(field, newArr);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) e.lastName = 'نام خانوادگی الزامی است';
    if (!formData.fatherName.trim()) e.fatherName = 'نام پدر الزامی است';
    if (!formData.caseType) e.caseType = 'نوع پرونده الزامی است';
    if (!formData.passportNumber.trim()) e.passportNumber = 'شماره پاسپورت الزامی است';
    if (!formData.dateOfBirth) e.dateOfBirth = 'تاریخ تولد الزامی است';
    if (!formData.province.trim()) e.province = 'ولایت/استان الزامی است';
    if (!formData.whatsappNumber.trim()) e.whatsappNumber = 'شماره واتساپ الزامی است';
    if (!formData.emergencyContact.trim()) e.emergencyContact = 'تماس اضطراری الزامی است';
    if (!formData.email.trim()) e.email = 'ایمیل الزامی است';
    else if (!formData.email.includes('@')) e.email = 'ایمیل معتبر نیست';
    if (!formData.q1SecurityProblems) e.q1SecurityProblems = 'پاسخ الزامی است';
    if (!formData.q2PriorFilings) e.q2PriorFilings = 'پاسخ الزامی است';
    if (!formData.q3ProofFiles) e.q3ProofFiles = 'پاسخ الزامی است';
    if (!formData.q4TransitBudget) e.q4TransitBudget = 'پاسخ الزامی است';
    if (!formData.q5PassportValidity) e.q5PassportValidity = 'پاسخ الزامی است';
    if (formData.awarenessSource.length === 0) e.awarenessSource = 'حداقل یک گزینه انتخاب کنید';
    if (formData.legalDocs.length === 0) e.legalDocs = 'حداقل یک گزینه انتخاب کنید';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveDraft = () => {
    localStorage.setItem(`visa_form_${formType}`, JSON.stringify(formData));
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(`visa_form_${formType}`);
    if (saved) {
      setFormData(JSON.parse(saved));
      setShowSavedMsg(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(`visa_form_${formType}`);
    setFormData(DEFAULT_FORM_DATA);
    setShowSavedMsg(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setShowPreview(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const inv = `INV-${Date.now().toString(36).toUpperCase()}`;
      const appt = new Date();
      appt.setDate(appt.getDate() + 14);

      await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            id: inv,
            created_at: new Date().toISOString(),
            form_type: formType,
            first_name: formData.firstName,
            last_name: formData.lastName,
            father_name: formData.fatherName,
            case_type: formData.caseType,
            family_count: formData.caseType === 'family' ? formData.familyCount : 1,
            passport_number: formData.passportNumber,
            date_of_birth: formData.dateOfBirth,
            country: formData.country,
            province: formData.province,
            whatsapp: formData.whatsappNumber,
            emergency_contact: formData.emergencyContact,
            email: formData.email,
            q1_security: formData.q1SecurityProblems,
            q2_prior: formData.q2PriorFilings,
            q3_proof: formData.q3ProofFiles,
            q4_budget: formData.q4TransitBudget,
            q5_validity: formData.q5PassportValidity,
            awareness: formData.awarenessSource.join('، '),
            legal_docs: formData.legalDocs.join('، '),
            appointment_date: appt.toISOString().split('T')[0],
            status: 'درحال بررسی',
          }],
          sheet: 'applications',
        }),
      });

      setInvoiceNumber(inv);
      setShowSuccess(true);
    } catch (err) {
      alert('خطا در ارسال. دوباره تلاش کنید.');
    }
    setLoading(false);
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 outline-none transition-all ${errors[field] ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-700 p-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{form?.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{form?.titleFa || 'فرم درخواست'}</h2>
            <p className="text-blue-100 text-sm mt-1">{form?.title || 'Visa Application'}</p>
          </div>
        </div>
      </div>

      {/* Success State */}
      {showSuccess ? (
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">درخواست شما ثبت شد!</h3>
          <p className="text-slate-500 mb-4">شماره پیگیری شما:</p>
          <p className="text-2xl font-mono font-bold text-gold-500 mb-6">{invoiceNumber}</p>
          <p className="text-sm text-slate-400 mb-6">تیم ما ظرف ۲۴ ساعت با شما تماس خواهد گرفت.</p>
          <button onClick={() => { localStorage.removeItem(`visa_form_${formType}`); window.location.href = '/'; }} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl">
            بازگشت به صفحه اصلی
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                <button type="button" onClick={clearDraft} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  شروع جدید
                </button>
              </div>
            </div>
          )}
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gold-500" />
              ۱. اطلاعات شخصی
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: 'firstName', l: 'نام *', p: 'نام' },
                { k: 'lastName', l: 'نام خانوادگی *', p: 'تخلص' },
                { k: 'fatherName', l: 'نام پدر *', p: 'اسم پدر' },
                { k: 'dateOfBirth', l: 'تاریخ تولد *', p: '', type: 'date' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.l}</label>
                  <input
                    type={f.type || 'text'}
                    value={(formData as any)[f.k]}
                    onChange={e => update(f.k as any, e.target.value)}
                    placeholder={f.p}
                    className={inputClass(f.k)}
                  />
                  {errors[f.k] && <p className="text-xs text-red-500 mt-1">{errors[f.k]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Case Type */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-500" />
              ۲. نوع پرونده
            </h3>
            <div className="flex gap-4 flex-wrap">
              {[
                { v: 'individual', l: 'انفرادی' },
                { v: 'family', l: 'فامیلی' },
              ].map(o => (
                <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="caseType" checked={formData.caseType === o.v} onChange={() => update('caseType', o.v)} className="w-4 h-4 accent-gold-500" />
                  <span className="text-slate-700 dark:text-slate-300">{o.l}</span>
                </label>
              ))}
            </div>
            {errors.caseType && <p className="text-xs text-red-500 mt-1">{errors.caseType}</p>}
            {formData.caseType === 'family' && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تعداد اعضای خانواده</label>
                <input type="number" min={2} value={formData.familyCount} onChange={e => update('familyCount', Number(e.target.value))} className={inputClass('familyCount')} />
              </div>
            )}
          </div>

          {/* Passport & Location */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-gold-500" />
              ۳. پاسپورت و محل سکونت
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">شماره پاسپورت *</label>
                <input type="text" value={formData.passportNumber} onChange={e => update('passportNumber', e.target.value)} placeholder="AA1234567" className={inputClass('passportNumber')} />
                {errors.passportNumber && <p className="text-xs text-red-500 mt-1">{errors.passportNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">کشور *</label>
                <select value={formData.country} onChange={e => update('country', e.target.value)} className={inputClass('country')}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ولایت/استان *</label>
                <input type="text" value={formData.province} onChange={e => update('province', e.target.value)} placeholder="کابل" className={inputClass('province')} />
                {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gold-500" />
              ۴. اطلاعات تماس
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: 'whatsappNumber', l: 'شماره واتساپ *', p: '+93 700 000 000', icon: Phone },
                { k: 'emergencyContact', l: 'تماس اضطراری *', p: '+93 700 000 000', icon: Phone },
                { k: 'email', l: 'ایمیل *', p: 'example@email.com', type: 'email', icon: Mail },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.l}</label>
                  <input
                    type={f.type || 'text'}
                    value={(formData as any)[f.k]}
                    onChange={e => update(f.k as any, e.target.value)}
                    placeholder={f.p}
                    className={inputClass(f.k)}
                  />
                  {errors[f.k] && <p className="text-xs text-red-500 mt-1">{errors[f.k]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gold-500" />
              ۵. سوالات
            </h3>
            <div className="space-y-4">
              {[
                { k: 'q1SecurityProblems', q: 'آیا مشکل امنیتی دارید؟' },
                { k: 'q2PriorFilings', q: 'آیا قبلاً درخواست داده‌اید؟' },
                { k: 'q3ProofFiles', q: 'آیا مدرک اثباتی دارید؟' },
                { k: 'q4TransitBudget', q: 'آیا بودجه سفر دارید؟' },
                { k: 'q5PassportValidity', q: 'آیا پاسپورت بیش از ۶ ماه اعتبار دارد؟' },
              ].map(item => (
                <div key={item.k}>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{item.q}</p>
                  <div className="flex gap-4">
                    {[
                      { v: 'yes', l: 'بله' },
                      { v: 'no', l: 'خیر' },
                    ].map(o => (
                      <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={item.k} checked={(formData as any)[item.k] === o.v} onChange={() => update(item.k as any, o.v)} className="w-4 h-4 accent-gold-500" />
                        <span className="text-slate-700 dark:text-slate-300">{o.l}</span>
                      </label>
                    ))}
                  </div>
                  {errors[item.k] && <p className="text-xs text-red-500 mt-1">{errors[item.k]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Awareness Source */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">۶. منبع آشنایی *</h3>
            <div className="flex flex-wrap gap-3">
              {AWARENESS_OPTIONS.map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.awarenessSource.includes(o)} onChange={() => toggleArray('awarenessSource', o)} className="w-4 h-4 accent-gold-500 rounded" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{o}</span>
                </label>
              ))}
            </div>
            {errors.awarenessSource && <p className="text-xs text-red-500 mt-1">{errors.awarenessSource}</p>}
          </div>

          {/* Legal Docs */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">۷. مدارک حقوقی موجود *</h3>
            <div className="flex flex-wrap gap-3">
              {LEGAL_DOCS_OPTIONS.map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.legalDocs.includes(o)} onChange={() => toggleArray('legalDocs', o)} className="w-4 h-4 accent-gold-500 rounded" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{o}</span>
                </label>
              ))}
            </div>
            {errors.legalDocs && <p className="text-xs text-red-500 mt-1">{errors.legalDocs}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 bg-gold-400 hover:bg-gold-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow hover:shadow-lg">
              <Send className="w-5 h-5" />
              ارسال درخواست
            </button>
            <button type="button" onClick={saveDraft} className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-300 dark:border-slate-600">
              <Save className="w-5 h-5" />
              ذخیره و ادامه بعدی
            </button>
          </div>
        </form>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="bg-slate-900 p-4 flex items-center justify-between">
              <h3 className="font-bold text-white">بررسی اطلاعات</h3>
              <button onClick={() => setShowPreview(false)} className="p-1 bg-white/20 rounded text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">نام:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.firstName}</span></div>
                <div><span className="text-slate-500">نام خانوادگی:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.lastName}</span></div>
                <div><span className="text-slate-500">نام پدر:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.fatherName}</span></div>
                <div><span className="text-slate-500">پاسپورت:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.passportNumber}</span></div>
                <div><span className="text-slate-500">واتساپ:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.whatsappNumber}</span></div>
                <div><span className="text-slate-500">ایمیل:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.email}</span></div>
              </div>
              <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl text-sm">
                <p className="text-slate-700 dark:text-slate-300">با تأیید، اطلاعات شما ثبت خواهد شد و ظرف ۲۴ ساعت با شما تماس می‌گیریم.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={confirmSubmit} disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60">
                  {loading ? 'در حال ارسال...' : 'تأیید و ارسال'}
                </button>
                <button onClick={() => setShowPreview(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl">بازگشت</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
