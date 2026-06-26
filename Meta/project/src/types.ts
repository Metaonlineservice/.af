export interface FormData {
  id?: string;
  createdAt?: string;

  // Basic Profile
  firstName: string;
  lastName: string;
  fatherName: string;

  // Case Structure
  caseType: 'individual' | 'family';
  familyCount: number;

  // Passport & DOB
  passportNumber: string;
  dateOfBirth: string;

  // Children
  sonsCount: number;
  daughtersCount: number;
  sonsNames: string[];
  daughtersNames: string[];

  // Location
  country: string;
  province: string;

  // Contact
  whatsappNumber: string;
  emergencyContact: string;
  email: string;

  // Background Questions
  q1SecurityProblems: 'yes' | 'no' | '';
  q2PriorFilings: 'yes' | 'no' | '';
  q3ProofFiles: 'yes' | 'no' | '';
  q4TransitBudget: 'yes' | 'no' | '';
  q5PassportValidity: 'yes' | 'no' | '';
  q6DocumentUpload: 'yes' | 'no' | '';
  uploadedDocument: File | null;
  q7ReferenceChannel: string[];
  q8AwarenessSource: string[];
  q9LegalDocs: string[];
  q10PortraitFiles: File[];

  // Terms
  termsAccepted: 'yes' | 'no' | '';
  rejectionReason: string;

  // Form type
  formType: string;
}

export type EmbassyFormType =
  | 'australia'
  | 'germany'
  | 'italy'
  | 'switzerland'
  | 'france'
  | 'canada'
  | 'other';

export interface EmbassyFormInfo {
  id: EmbassyFormType;
  title: string;
  titleFa: string;
  badge?: string;
  icon: string;
}

export const EMBASSY_FORMS: EmbassyFormInfo[] = [
  {
    id: 'australia',
    title: 'Australia Humanitarian Visa Form',
    titleFa: 'فورم ثبت درخواست استرالیا',
    badge: 'ویژه',
    icon: '🇦🇺'
  },
  {
    id: 'germany',
    title: 'Germany Human Rights Case Form',
    titleFa: 'فورم ثبت درخواست آلمان',
    badge: 'پرطرفدار',
    icon: '🇩🇪'
  },
  {
    id: 'italy',
    title: 'Italy Family Reunification & Visa Form',
    titleFa: 'فورم ثبت درخواست ایتالیا',
    icon: '🇮🇹'
  },
  {
    id: 'switzerland',
    title: 'Switzerland Protection Visa Form',
    titleFa: 'فورم ثبت درخواست سوئیس',
    badge: 'جدید',
    icon: '🇨🇭'
  },
  {
    id: 'france',
    title: 'France Asylum Appointment Form',
    titleFa: 'فورم ثبت درخواست فرانسه',
    icon: '🇫🇷'
  },
  {
    id: 'canada',
    title: 'Canada Special Immigration Form',
    titleFa: 'فورم ثبت درخواست کانادا',
    badge: 'مهاجرتی',
    icon: '🇨🇦'
  },
  {
    id: 'other',
    title: 'Global Cross-Border Embassy Form',
    titleFa: 'سایر سفارت‌خانه‌ها',
    icon: '🌍'
  }
];

export const COUNTRIES_AND_PROVINCES: Record<string, { name: string; provinces: string[] }> = {
  'افغانستان': {
    name: 'Afghanistan',
    provinces: ['کابل', 'هرات', 'بلخ', 'قندهار', 'ننگرهار', 'بادغیس', 'کندز', 'غزنی', 'پروان', 'لوگر']
  },
  'پاکستان': {
    name: 'Pakistan',
    provinces: ['اسلام‌آباد', 'پشاور', 'کویته', 'لاهور', 'کراچی', 'مولتان', 'راولپنندی', 'سیالکوت']
  },
  'ایران': {
    name: 'Iran',
    provinces: ['تهران', 'مشهد', 'زاهدان', 'اصفهان', 'شیراز', 'تبریز', 'کرمان', 'کرمانشاه', 'همدان', 'یزد']
  },
  'تاجکستان': {
    name: 'Tajikistan',
    provinces: ['دوشنبه', 'خجند', 'قلم', 'خاروغ', 'کولیاب']
  }
};

export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  currency: 'AFN' | 'USD' | 'EUR';
  description: string;
  features: string[];
}

export const SERVICES: ServicePackage[] = [
  {
    id: 'basic',
    title: 'درخواست عادی و ایجاد پرونده',
    price: '3,000',
    currency: 'AFN',
    description: 'ثبت درخواست پایه و ایجاد پرونده اولیه',
    features: ['ثبت اطلاعات اولیه', 'ایجاد پرونده', 'پیگیری تلفنی']
  },
  {
    id: 'premium',
    title: 'ثبت درخواست نیمه عالی و پیگیری',
    price: '5,500',
    currency: 'AFN',
    description: 'خدمات نیمه حرفه‌ای با پیگیری کامل',
    features: ['تمام امکانات عادی', 'پیگیری مداوم', 'مشاوره اولیه', 'هماهنگی با سفارت']
  },
  {
    id: 'expert',
    title: 'ثبت درخواست تخصصی با وکلای حقوقی',
    price: '10,000',
    currency: 'AFN',
    description: 'خدمات ویژه با وکیل حقوقی مجرب',
    features: ['تمام امکانات نیمه عالی', 'وکیل اختصاصی', 'تهیه مدارک حقوقی', 'نمایندگی در دادگاه']
  }
];

export interface EmbassyFee {
  country: string;
  name: string;
  flag: string;
  fees: { type: string; amount: string; currency: string }[];
}

export const EMBASSY_FEES: EmbassyFee[] = [
  {
    country: 'switzerland',
    name: 'سوئیس',
    flag: '🇨🇭',
    fees: [{ type: 'ویزای حفاظتی', amount: '1,000', currency: 'USD' }]
  },
  {
    country: 'germany',
    name: 'آلمان',
    flag: '🇩🇪',
    fees: [{ type: 'پرونده حقوق بشری', amount: '380', currency: 'USD' }]
  },
  {
    country: 'italy',
    name: 'ایتالیا',
    flag: '🇮🇹',
    fees: [
      { type: 'ویزای استاندارد', amount: '230', currency: 'EUR' },
      { type: 'پیوند فامیلی', amount: '2,500', currency: 'USD' }
    ]
  },
  {
    country: 'france',
    name: 'فرانسه',
    flag: '🇫🇷',
    fees: [{ type: 'وقت پناهندگی', amount: '500', currency: 'USD' }]
  },
  {
    country: 'canada',
    name: 'کانادا',
    flag: '🇨🇦',
    fees: [{ type: 'مهاجرت ویژه', amount: '1,000', currency: 'USD' }]
  }
];

export const PAYMENT_METHODS = [
  { id: 'crypto', name: 'ارز دیجیتال', icon: 'Bitcoin' },
  { id: 'mastercard', name: 'مسترکارت - بانک عزیزی', icon: 'CreditCard' },
  { id: 'zarinpal', name: 'زرین‌پال (ریال)', icon: 'Wallet' },
  { id: 'wise', name: 'وایز بانک', icon: 'Building2' }
];

export const REFERENCE_CHANNELS = [
  { id: 'iom', label: 'IOM' },
  { id: 'unhcr', label: 'UNHCR' },
  { id: 'panaga', label: 'پانگا' },
  { id: 'none', label: 'هیچکدام' }
];

export const AWARENESS_SOURCES = [
  { id: 'facebook', label: 'فیسبوک' },
  { id: 'instagram', label: 'اینستاگرام' },
  { id: 'whatsapp', label: 'واتساپ' },
  { id: 'friends', label: 'دوستان' }
];

export const LEGAL_DOCS = [
  { id: 'passport', label: 'پاسپورت' },
  { id: 'eid_card', label: 'تذکره برقی' },
  { id: 'education', label: 'مدارک تحصیلی' },
  { id: 'invitation', label: 'دعوت‌نامه حمایتی' }
];
