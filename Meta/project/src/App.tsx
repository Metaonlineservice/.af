import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
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
      <Header onMenuClick={() => {}} onEmergencyClick={() => {}} />
      <div className="pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <VisaForm formType={form.id as EmbassyFormType} />
      </div>
      <Footer />
      <ChatWidget />
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onEmergencyClick={() => setEmergencyOpen(true)}
      />
      <main className="pt-14">
        <Hero onFormClick={() => handleFormSelect('germany')} />
        <Services />
        <Reviews />
      </main>
      <Footer />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFormSelect={handleFormSelect}
      />
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
      <ChatWidget />
    </div>
  );
}

// App Content
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form/:type" element={<FormPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminGuard />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
