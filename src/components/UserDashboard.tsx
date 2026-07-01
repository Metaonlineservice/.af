import React, { useState, useEffect } from 'react';
import {
  FileText, CheckCircle2, Clock, XCircle, Bell, Inbox,
  RefreshCw, ChevronDown, ChevronUp, TrendingUp, Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SHEETDB_API, SHEET_NAMES } from '../config/apiConfig';

interface Application {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  passport_number: string;
  form_type: string;
  appointment_date: string;
  status: string;
  country: string;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  is_read: boolean;
  is_broadcast: boolean;
  sender_email: string;
}

const PROGRESS: Record<string, { pct: number; steps: string[] }> = {
  pending: {
    pct: 25,
    steps: ['ثبت درخواست ✓', 'بررسی اولیه ...', 'آماده‌سازی مدارک', 'وقت سفارت'],
  },
  approved: {
    pct: 100,
    steps: ['ثبت درخواست ✓', 'بررسی اولیه ✓', 'آماده‌سازی مدارک ✓', 'وقت سفارت ✓'],
  },
  rejected: {
    pct: 50,
    steps: ['ثبت درخواست ✓', 'بررسی اولیه ✗', 'آماده‌سازی مدارک', 'وقت سفارت'],
  },
};

const FLAG: Record<string, string> = {
  germany: '🇩🇪', australia: '🇦🇺', italy: '🇮🇹', switzerland: '🇨🇭',
  france: '🇫🇷', canada: '🇨🇦', other: '🌍',
};

interface Props { onClose: () => void; }

export function UserDashboard({ onClose }: Props) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<'apps' | 'inbox'>('apps');
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const appRes = await fetch(`${SHEETDB_API}/search?sheet=${SHEET_NAMES.APPLICATIONS}&email=${encodeURIComponent(user.email)}`);
      const apps = await appRes.json();
      if (Array.isArray(apps)) setApplications(apps.reverse());
    } catch {}

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const markRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">حساب کاربری</h1>
            <p className="text-slate-400 text-sm">{user?.firstName} {user?.lastName}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="بروزرسانی">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
              بازگشت
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'کل درخواست‌ها', value: applications.length, icon: <FileText className="w-5 h-5" />, cls: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'در انتظار', value: applications.filter(a => a.status === 'pending').length, icon: <Clock className="w-5 h-5" />, cls: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'پیام جدید', value: unreadCount, icon: <Bell className="w-5 h-5" />, cls: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.cls}`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow">
          {([['apps', 'درخواست‌های من', <FileText className="w-4 h-4" />], ['inbox', `صندوق پیام ${unreadCount > 0 ? `(${unreadCount})` : ''}`, <Inbox className="w-4 h-4" />]] as [string, string, React.ReactNode][]).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setTab(key as 'apps' | 'inbox')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          </div>
        ) : tab === 'apps' ? (
          /* Applications List */
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">هنوز درخواستی ثبت نشده است</p>
              </div>
            ) : applications.map(app => {
              const prog = PROGRESS[app.status] || PROGRESS.pending;
              const isExp = expandedApp === app.id;
              const statusColor = app.status === 'approved' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                : app.status === 'rejected' ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
              const statusLabel = app.status === 'approved' ? 'تأیید شده' : app.status === 'rejected' ? 'رد شده' : 'در انتظار';
              const StatusIcon = app.status === 'approved' ? CheckCircle2 : app.status === 'rejected' ? XCircle : Clock;

              return (
                <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div
                    className="p-5 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedApp(isExp ? null : app.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{FLAG[app.form_type] || '🌍'}</div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {app.first_name} {app.last_name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{app.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusLabel}
                      </span>
                      {isExp ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {isExp && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-5">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            پیشرفت پرونده
                          </p>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{prog.pct}٪</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${app.status === 'approved' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-1 mt-3">
                          {prog.steps.map((step, i) => (
                            <div key={i} className="text-center">
                              <div className={`text-xs px-1 py-1 rounded ${i < prog.steps.filter(s => s.includes('✓')).length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                {step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          ['شماره پاسپورت', app.passport_number],
                          ['کشور مقصد', app.country],
                          ['تاریخ وقت', app.appointment_date || '—'],
                          ['تاریخ ثبت', app.created_at ? new Date(app.created_at).toLocaleDateString('fa-IR') : '—'],
                        ].map(([lbl, val]) => (
                          <div key={lbl} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5">
                            <p className="text-xs text-slate-400 mb-0.5">{lbl}</p>
                            <p className="font-medium text-slate-900 dark:text-white">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Inbox */
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">صندوق پیام خالی است</p>
              </div>
            ) : messages.map(msg => (
              <div
                key={msg.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow border transition-all cursor-pointer p-5 ${!msg.is_read ? 'border-blue-300 dark:border-blue-700' : 'border-slate-200 dark:border-slate-700'}`}
                onClick={() => markRead(msg.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                    <h4 className={`font-semibold text-sm ${!msg.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {msg.subject}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {msg.is_broadcast && (
                      <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs rounded-full">عمومی</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{msg.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
