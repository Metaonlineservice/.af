// Unified API Configuration for Meta Online Service
// All forms and components should import from this single source
// API URL is now configurable at runtime via settings

import { getSheetDbApi, getSheetName } from './settings';

// Default SheetDB API (fallback)
export const SHEETDB_API_DEFAULT = 'https://sheetdb.io/api/v1/j92iddttd3260';

// Dynamic getter for SheetDB API - call this function to get current API
export function getApiUrl(): string {
  return getSheetDbApi();
}

// For backwards compatibility, export as string-like object
// This will be deprecated in favor of getApiUrl()
export const SHEETDB_API = SHEETDB_API_DEFAULT;

// Google Sheet ID
export const GOOGLE_SHEET_ID = '12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no';

// Sheet Names - static for import, use getSheetName() for dynamic
export const SHEET_NAMES = {
  APPLICATIONS: 'applications',
  APPOINTMENTS: 'appointments',
  EMERGENCY: 'emergency',
  USERS: 'users',
  CHATBOT: 'chatbot',
  CONTACTS: 'contacts',
  NEWSLETTER: 'newsletter',
  REVIEWS: 'reviews',
  SERVICES: 'services',
  SUCCESSFUL_CASES: 'successful_cases',
  INPROCESS_CASES: 'inprocess_cases',
  CUSTOMERS: 'customers',
  DEFAULT: 'Sheet1',
} as const;

// Contact Information - uses environment variables with fallbacks
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+93730556547';
export const CONTACT_INFO = {
  whatsapp: whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`,
  phone: import.meta.env.VITE_PHONE_NUMBER || '+93730556547',
  email: import.meta.env.VITE_EMAIL || 'metaonlineservice3@gmail.com',
  address: import.meta.env.VITE_OFFICE_ADDRESS || 'کوته سنگی ، گولایی دواخانه ، مارکیت سبزوار ، منزل دوم دفتر شماره 14',
  googleMapsUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=G449%2BRQC,+Halabi+Sazi+Ave+Rd,+Kabul+1006,+Afghanistan',
  website: import.meta.env.VITE_SITE_URL || 'https://metaonlineservice.com',
};

// Form Notice Message
export const FORM_NOTICE = 'اگر که شما قادر اخذ ملاقات نیستید میتوانید به شماره واتساپ پیام نموده تا تیم کاری ما وقت ملاقات برای شما اخذ کند.';

// Countries for visa forms
export const COUNTRIES = ['آلمان', 'استرالیا', 'ایتالیا', 'سوئیس', 'فرانسه', 'کانادا', 'انگلیس', 'سایر'];

// Provinces
export const PROVINCES = ['کابل', 'هرات', 'بلخ', 'قندهار', 'ننگرهار', 'کندز', 'بامیان', 'پروان', 'غزنی', 'مزار شریف'];

// Time slots for appointments
export const TIME_SLOTS = ['۸:۰۰ صبح', '۹:۰۰ صبح', '۱۰:۰۰ صبح', '۱۱:۰۰ صبح', '۱۲:۰۰ ظهر', '۱:۰۰ بعدازظهر', '۲:۰۰ بعدازظهر', '۳:۰۰ بعدازظهر', '۴:۰۰ بعدازظهر'];

// Emergency types
export const EMERGENCY_TYPES = [
  'بازداشت توسط مراجع امنیتی',
  'تهدید جانی فوری',
  'اخراج اجباری',
  'خشونت خانگی',
  'پرونده در خطر انقضا',
  'وضعیت پناهندگی تهدید شده',
  'سایر',
];

// Awareness sources
export const AWARENESS_OPTIONS = ['واتساپ', 'فیسبوک', 'اینستاگرام', 'معرفی دوست', 'سایر'];

// Legal docs options
export const LEGAL_DOCS_OPTIONS = ['پاسپورت', 'تذکره', 'حکم دادگاه', 'مدرک کار', 'سایر'];

// Visa form types
export const VISA_FORM_TYPES = [
  { id: 'germany', title: 'Germany Visa', titleFa: 'ویزای آلمان', icon: '🇩🇪' },
  { id: 'italy', title: 'Italy Visa', titleFa: 'ویزای ایتالیا', icon: '🇮🇹' },
  { id: 'france', title: 'France Visa', titleFa: 'ویزای فرانسه', icon: '🇫🇷' },
  { id: 'switzerland', title: 'Switzerland Visa', titleFa: 'ویزای سوئیس', icon: '🇨🇭' },
  { id: 'canada', title: 'Canada Visa', titleFa: 'ویزای کانادا', icon: '🇨🇦' },
  { id: 'australia', title: 'Australia Visa', titleFa: 'ویزای استرالیا', icon: '🇦🇺' },
];

// Helper function to build sheet URL with dynamic API
export function getSheetUrl(sheetName?: string): string {
  const api = getApiUrl();
  if (sheetName) {
    return `${api}?sheet=${sheetName}`;
  }
  return api;
}

// Helper function to search by field with dynamic API
export function getSearchUrl(sheetName: string, field: string, value: string): string {
  return `${getApiUrl()}/search?sheet=${sheetName}&${field}=${encodeURIComponent(value)}`;
}

// Helper function to get record by ID with dynamic API
export function getRecordUrl(id: string, sheetName?: string): string {
  const api = getApiUrl();
  const sheetParam = sheetName ? `?sheet=${sheetName}` : '';
  return `${api}/id/${id}${sheetParam}`;
}

// API request helper with proper error handling - uses dynamic API
export async function postToSheet<T>(sheetName: string, data: T): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const api = getApiUrl();
    const response = await fetch(`${api}?sheet=${sheetName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [data] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SheetDB error:', response.status, errorText);
      return { success: false, error: `Server error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

// Search helper with proper error handling - uses dynamic API
export async function searchSheet<T>(sheetName: string, field: string, value: string): Promise<{ success: boolean; data?: T[]; error?: string }> {
  try {
    const api = getApiUrl();
    const response = await fetch(`${api}/search?sheet=${sheetName}&${field}=${encodeURIComponent(value)}`);

    if (!response.ok) {
      return { success: false, error: `Server error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}
