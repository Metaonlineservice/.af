import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fa' | 'ps' | 'en';

interface Translations {
  [key: string]: {
    fa: string;
    ps: string;
    en: string;
  };
}

const TRANSLATIONS: Translations = {
  siteName: { fa: 'خدمات آنلاین میتا', ps: 'د میتا آنلاین خدمات', en: 'Meta Online Service' },
  emergency: { fa: 'اضطراری', ps: 'بړنکی', en: 'Emergency' },
  admin: { fa: 'مدیریت', ps: 'مدیریت', en: 'Admin' },
  services: { fa: 'خدمات', ps: 'خدمات', en: 'Services' },
  reviews: { fa: 'نظرات موکلین', ps: 'د پیرودونکو نظرونه', en: 'Client Reviews' },
  contact: { fa: 'تماس', ps: 'اړیکه', en: 'Contact' },
  appointment: { fa: 'قرار ملاقات', ps: 'د لیدنې وخت', en: 'Appointment' },
  bookAppointment: { fa: 'رزرو قرار ملاقات', ps: 'د لیدنې وخت محفوظ کړئ', en: 'Book Appointment' },
  addressResponse: {
    fa: 'قبل از مراجعه حضوری اخذ قرار ملاقات الزامی میباشد. برای اخذ قرار ملاقات حضوری اینجا کلیک نماید',
    ps: 'د شخصي Besuch دمخه د لیدنې وخت اخیستل اړین دي. د لیدنې وخت لپاره دلته کلیک وکړئ',
    en: 'An appointment is required before visiting in person. Click here to book an appointment'
  },
  successfulCases: { fa: 'پرونده موفق', ps: 'بریالی پرونده', en: 'Successful Cases' },
  home: { fa: 'صفحه اصلی', ps: 'کور پاڼه', en: 'Home' },
  forms: { fa: 'فرم‌های ثبت‌نام', ps: 'د نوم لیکنې فورمې', en: 'Registration Forms' },
  successfulDocs: { fa: 'مدارک موفق', ps: 'بریالی اسناد', en: 'Successful Docs' },
  submit: { fa: 'ثبت', ps: 'تیبت', en: 'Submit' },
  cancel: { fa: 'انصراف', ps: 'لغوه', en: 'Cancel' },
  name: { fa: 'نام', ps: 'نوم', en: 'Name' },
  lastName: { fa: 'نام خانوادگی', ps: 'کورنی نوم', en: 'Last Name' },
  fatherName: { fa: 'نام پدر', ps: 'د پلار نوم', en: "Father's Name" },
  phone: { fa: 'شماره تماس', ps: 'تلیفون شمېره', en: 'Phone' },
  email: { fa: 'ایمیل', ps: 'برېښنالیک', en: 'Email' },
  province: { fa: 'ولایت', ps: 'ولایت', en: 'Province' },
  destination: { fa: 'کشور مقصد', ps: 'مقصد هیواد', en: 'Destination' },
  date: { fa: 'تاریخ', ps: 'نیټه', en: 'Date' },
  time: { fa: 'ساعت', ps: 'وخت', en: 'Time' },
  message: { fa: 'پیام', ps: 'پیغام', en: 'Message' },
  loading: { fa: 'در حال بارگذاری...', ps: 'په بارېدو کې...', en: 'Loading...' },
  formSubmitted: { fa: 'فرم شما با موفقیت ثبت شد', ps: 'ستاسو فورمه بریالیتوب سره ثبت شوه', en: 'Your form has been submitted successfully' },
  freeConsultation: { fa: 'مشاوره رایگان', ps: 'وړیا مشوره', en: 'Free Consultation' },
  visaServices: { fa: 'خدمات تخصصی مهاجرتی', ps: 'د کډوالو تخصصي خدمات', en: 'Immigration Services' },
  ourClientsExperience: { fa: 'تجربه موکلین ما', ps: 'د پیرودونکو تجربه', en: 'Our Clients Experience' },
  whatsapp: { fa: 'واتساپ', ps: 'واتساپ', en: 'WhatsApp' },
  facebook: { fa: 'فیس‌بوک', ps: 'فیس‌بوک', en: 'Facebook' },
  instagram: { fa: 'اینستاگرام', ps: 'اینستاگرام', en: 'Instagram' },
  address: { fa: 'آدرس', ps: 'پته', en: 'Address' },
  call: { fa: 'تماس', ps: 'زنګ', en: 'Call' },
  backToTop: { fa: 'بازگشت به بالا', ps: 'بېرته پورته', en: 'Back to Top' },
  allRightsReserved: { fa: 'تمامی حقوق محفوظ است', ps: 'ټول حقوق ساتل شوی', en: 'All Rights Reserved' },
  appointmentRequired: {
    fa: 'قبل از مراجعه حضوری اخذ قرار ملاقات الزامی میباشد',
    ps: 'د شخصي Besuch دمخه د لیدنې وخت اخیستل اړین دي',
    en: 'Appointment required before visiting'
  },
  clickHere: { fa: 'اینجا کلیک نماید', ps: 'دلته کلیک وکړئ', en: 'Click here' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fa';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  }, [language]);

  const t = (key: string): string => {
    const translation = TRANSLATIONS[key];
    if (!translation) return key;
    return translation[language] || translation.fa;
  };

  const dir = language === 'en' ? 'ltr' : 'rtl';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
