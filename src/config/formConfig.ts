// Re-export from unified apiConfig
export { SHEETDB_API } from './apiConfig';

// Form Storage Key
export const FORM_STORAGE_KEY = 'multistep_form_data';

// Form Steps Configuration
export const FORM_STEPS = [
  { id: 'personal', title: 'اطلاعات شخصی', titleEn: 'Personal Information', icon: '👤' },
  { id: 'contact', title: 'اطلاعات تماس', titleEn: 'Contact Information', icon: '📞' },
  { id: 'documents', title: 'مدارک', titleEn: 'Documents', icon: '📄' },
  { id: 'review', title: 'بررسی نهایی', titleEn: 'Final Review', icon: '✅' },
];

// Form Field Configuration
export const FORM_FIELDS = {
  personal: [
    { name: 'firstName', label: 'نام', labelEn: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'نام خانوادگی', labelEn: 'Last Name', type: 'text', required: true },
    { name: 'fatherName', label: 'نام پدر', labelEn: "Father's Name", type: 'text', required: true },
    { name: 'dateOfBirth', label: 'تاریخ تولد', labelEn: 'Date of Birth', type: 'date', required: true },
    { name: 'gender', label: 'جنسیت', labelEn: 'Gender', type: 'select', options: ['مرد', 'زن'], required: true },
  ],
  contact: [
    { name: 'phone', label: 'شماره تماس', labelEn: 'Phone', type: 'tel', required: true },
    { name: 'email', label: 'ایمیل', labelEn: 'Email', type: 'email', required: true },
    { name: 'province', label: 'ولایت/استان', labelEn: 'Province', type: 'text', required: true },
    { name: 'address', label: 'آدرس', labelEn: 'Address', type: 'textarea', required: false },
  ],
  documents: [
    { name: 'passportNumber', label: 'شماره پاسپورت', labelEn: 'Passport Number', type: 'text', required: true },
    { name: 'passportExpiry', label: 'تاریخ انقضا', labelEn: 'Passport Expiry', type: 'date', required: true },
    { name: 'destinationCountry', label: 'کشور مقصد', labelEn: 'Destination Country', type: 'select', options: ['آلمان', 'استرالیا', 'ایتالیا', 'سوئیس', 'فرانسه', 'کانادا', 'انگلیس', 'سایر'], required: true },
    { name: 'purpose', label: 'هدف سفر', labelEn: 'Travel Purpose', type: 'select', options: ['پناهندگی', 'ویزای کاری', 'پیوند فامیلی', 'تحصیلی', 'سایر'], required: true },
    { name: 'notes', label: 'توضیحات اضافی', labelEn: 'Additional Notes', type: 'textarea', required: false },
  ],
};
