import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';
import { EmergencyModal } from './components/EmergencyModal';
import { AppointmentButton } from './components/AppointmentButton';
import { EmbassyFormType, EMBASSY_FORMS } from './types';
import { SplashScreen } from './components/SplashScreen';

// Lazy load heavy components for better performance
const VisaForm = lazy(() => import('./components/VisaForm').then(m => ({ default: m.VisaForm })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AppointmentForm = lazy(() => import('./components/AppointmentForm').then(m => ({ default: m.AppointmentForm })));
const MultiStepForm = lazy(() => import('./components/MultiStepForm').then(m => ({ default: m.MultiStepForm })));
const SuccessfulCases = lazy(() => import('./components/SuccessfulCases').then(m => ({ default: m.SuccessfulCases })));
const InProcessCases = lazy(() => import('./components/InProcessCases').then(m => ({ default: m.InProcessCases })));
const RegisteredCustomers = lazy(() => import('./components/RegisteredCustomers').then(m => ({ default: m.RegisteredCustomers })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-corporate-50 dark:bg-navy-950 flex items-center justify-center" dir="rtl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
      <p className="text-navy-600 dark:text-corporate-400 text-sm">در حال بارگذاری...</p>
    </div>
  </div>
);

const ADMIN_PASSWORD = '123456789';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Focus management for accessibility
function FocusManager() {
  const location = useLocation();

  useEffect(() => {
    // Focus main content area on route change for screen readers
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  return null;
}

// Admin Login Page
function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-navy-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-9 h-9 text-white" viewBox="0 0 100 100" fill="none">
                <path d="M20 75 L20 25 L35 50 L50 25 L65 50 L80 25 L80 75" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">ورود به مدیریت</h1>
            <p className="text-sm text-slate-400 mt-1">Meta Online Service</p>
          </div>
          {error && <p role="alert" className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-password" className="sr-only">رمز عبور</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="رمز عبور"
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-navy-800 border-0 rounded-xl text-white placeholder-corporate-400 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            />
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all">
              ورود
            </button>
          </form>
          <a href="/" className="block text-center text-corporate-400 text-sm mt-6 hover:text-white">بازگشت به سایت</a>
        </div>
      </div>
    </div>
  );
}

// Admin Guard
function AdminGuard() {
  const isAuth = sessionStorage.getItem('admin_auth') === 'true';
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminPanel onClose={() => window.location.href = '/'} />
    </Suspense>
  );
}

// Visa Form Page
function FormPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const form = EMBASSY_FORMS.find(f => f.id === type);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const handleFormSelect = (formId: EmbassyFormType) => {
    navigate(`/form/${formId}`);
    setSidebarOpen(false);
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-corporate-50 dark:bg-navy-950 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">فرم یافت نشد</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-semibold">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-corporate-50 dark:bg-navy-950" dir="rtl">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onEmergencyClick={() => setEmergencyOpen(true)}
        onAppointmentClick={() => navigate('/appointment')}
      />
      <div id="main-content" className="pt-20 pb-16 px-4 max-w-4xl mx-auto" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <VisaForm formType={form.id as EmbassyFormType} />
        </Suspense>
      </div>
      <Footer />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFormSelect={handleFormSelect}
        onAppointmentClick={() => { navigate('/appointment'); setSidebarOpen(false); }}
      />
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
      <ChatWidget onAppointmentClick={() => navigate('/appointment')} />
    </div>
  );
}

// Appointment Page
function AppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-50 to-corporate-100 dark:from-navy-950 dark:to-navy-900" dir="rtl">
      <Header onMenuClick={() => {}} onEmergencyClick={() => {}} onAppointmentClick={() => {}} />
      <div id="main-content" className="pt-20" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <AppointmentForm />
        </Suspense>
      </div>
      <Footer />
      <ChatWidget onAppointmentClick={() => {}} />
    </div>
  );
}

// Home Page
function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const navigate = useNavigate();

  const handleFormSelect = (formId: EmbassyFormType) => {
    navigate(`/form/${formId}`);
  };

  const handleAppointmentClick = () => {
    navigate('/appointment');
  };

  return (
    <div className="min-h-screen bg-corporate-50 dark:bg-navy-950" dir="rtl">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onEmergencyClick={() => setEmergencyOpen(true)}
        onAppointmentClick={handleAppointmentClick}
      />
      <main id="main-content" className="pt-14" tabIndex={-1}>
        <Hero onFormClick={() => handleFormSelect('germany')} onAppointmentClick={handleAppointmentClick} />
        <Services />
        <div id="successful-cases">
          <Suspense fallback={<div className="py-20 text-center text-corporate-500">در حال بارگذاری...</div>}>
            <SuccessfulCases />
          </Suspense>
        </div>
        <div id="inprocess-cases">
          <Suspense fallback={<div className="py-20 text-center text-corporate-500">در حال بارگذاری...</div>}>
            <InProcessCases />
          </Suspense>
        </div>
        <div id="registered-customers">
          <Suspense fallback={<div className="py-20 text-center text-corporate-500">در حال بارگذاری...</div>}>
            <RegisteredCustomers />
          </Suspense>
        </div>
        <Reviews />
      </main>
      <Footer />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFormSelect={handleFormSelect}
        onAppointmentClick={handleAppointmentClick}
      />
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
      <ChatWidget onAppointmentClick={handleAppointmentClick} />
      <AppointmentButton onClick={handleAppointmentClick} />
    </div>
  );
}

// Multi-Step Form Page
function MultiStepFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-50 to-corporate-100 dark:from-navy-950 dark:to-navy-900" dir="rtl">
      <Suspense fallback={<PageLoader />}>
        <MultiStepForm />
      </Suspense>
      <ChatWidget onAppointmentClick={() => window.location.href = '/appointment'} />
    </div>
  );
}

// App Content
function AppContent() {
  return (
    <>
      <ScrollToTop />
      <FocusManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form/:type" element={<FormPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/multiform" element={<MultiStepFormPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard />} />
      </Routes>
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      // Preload settings
      const settings = localStorage.getItem('meta_settings');
      if (!settings) {
        // Set default settings
        localStorage.setItem('meta_settings', JSON.stringify({
          sheetdbApi: 'https://sheetdb.io/api/v1/j92iddttd3260',
          googleSheetId: '12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no',
          sheetNames: {
            applications: 'applications',
            appointments: 'appointments',
            emergency: 'emergency',
            users: 'users',
            chatbot: 'chatbot',
            contacts: 'contacts',
            newsletter: 'newsletter',
          },
          lastUpdated: new Date().toISOString(),
        }));
      } else {
        // Migrate any old SheetDB API URL to the new one
        try {
          const parsed = JSON.parse(settings);
          if (parsed.sheetdbApi && parsed.sheetdbApi !== 'https://sheetdb.io/api/v1/j92iddttd3260') {
            parsed.sheetdbApi = 'https://sheetdb.io/api/v1/j92iddttd3260';
            parsed.googleSheetId = '12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no';
            parsed.lastUpdated = new Date().toISOString();
            localStorage.setItem('meta_settings', JSON.stringify(parsed));
          }
        } catch (e) {
          // If parsing fails, reset to defaults
          localStorage.removeItem('meta_settings');
        }
      }
      setIsInitialized(true);
    };

    initApp();
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} minDuration={2500} />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
