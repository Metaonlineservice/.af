import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';
import { EmergencyModal } from './components/EmergencyModal';
import { VisaForm } from './components/VisaForm';
import { AdminPanel } from './components/AdminPanel';
import { AppointmentForm } from './components/AppointmentForm';
import { MultiStepForm } from './components/MultiStepForm';
import { SuccessfulCases } from './components/SuccessfulCases';
import { InProcessCases } from './components/InProcessCases';
import { RegisteredCustomers } from './components/RegisteredCustomers';
import { EmbassyFormType, EMBASSY_FORMS } from './types';

const ADMIN_PASSWORD = '123456789';

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">ورود به مدیریت</h1>
          </div>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="w-full px-4 py-3 bg-slate-700 border-0 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-gold-400 outline-none mb-4"
            />
            <button type="submit" className="w-full py-3 bg-gold-400 hover:bg-gold-500 text-slate-900 font-bold rounded-xl transition-all">
              ورود
            </button>
          </form>
          <a href="/" className="block text-center text-slate-400 text-sm mt-6 hover:text-white">بازگشت به سایت</a>
        </div>
      </div>
    </div>
  );
}

// Admin Guard
function AdminGuard() {
  const isAuth = sessionStorage.getItem('admin_auth') === 'true';
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <AdminPanel onClose={() => window.location.href = '/'} />;
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">فرم یافت نشد</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gold-400 hover:bg-gold-500 text-slate-900 rounded-xl font-semibold">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onEmergencyClick={() => setEmergencyOpen(true)}
        onAppointmentClick={() => navigate('/appointment')}
      />
      <div className="pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <VisaForm formType={form.id as EmbassyFormType} />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <Header onMenuClick={() => {}} onEmergencyClick={() => {}} onAppointmentClick={() => {}} />
      <div className="pt-20">
        <AppointmentForm />
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onEmergencyClick={() => setEmergencyOpen(true)}
        onAppointmentClick={handleAppointmentClick}
      />
      <main className="pt-14">
        <Hero onFormClick={() => handleFormSelect('germany')} onAppointmentClick={handleAppointmentClick} />
        <Services />
        <div id="successful-cases">
          <SuccessfulCases />
        </div>
        <div id="inprocess-cases">
          <InProcessCases />
        </div>
        <div id="registered-customers">
          <RegisteredCustomers />
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
    </div>
  );
}

// Multi-Step Form Page
function MultiStepFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <MultiStepForm />
      <ChatWidget onAppointmentClick={() => window.location.href = '/appointment'} />
    </div>
  );
}

// App Content
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form/:type" element={<FormPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
      <Route path="/multiform" element={<MultiStepFormPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminGuard />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
