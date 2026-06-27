import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Calendar, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  time: string;
  hasAction?: boolean;
  actionType?: 'appointment';
}

interface ChatResponse {
  id: string;
  keyword: string;
  response: string;
  is_active: string;
}

const DEFAULT_RESPONSES: Record<string, string[]> = {
  سلام: ['سلام! خوش آمدید به خدمات آنلاین میتا. چطور می‌توانم کمک کنم؟'],
  ویزا: ['ما خدمات ویزا برای کشورهای استرالیا، آلمان، ایتالیا، سوئیس، فرانسه و کانادا ارائه می‌دهیم. جهت ثبت درخواست، از منوی کناری استفاده کنید.'],
  قیمت: ['تعرفه خدمات ما:\n• درخواست عادی: ۳,۰۰۰ افغانی\n• نیمه عالی: ۵,۵۰۰ افغانی\n• تخصصی با وکیل: ۱۰,۰۰۰ افغانی'],
  آدرس: ['قبل از مراجعه حضوری اخذ قرار ملاقات الزامی میباشد. برای اخذ قرار ملاقات حضوری روی دکمه زیر کلیک کنید.'],
  تماس: ['برای تماس با ما:\nواتساپ: +989012055578\nتلفن: +93730556547\nایمیل: metaonlineservice3@gmail.com'],
  ساعت: ['ساعت کاری دفتر: شنبه تا چهارشنبه ۸ صبح تا ۵ بعدازظهر'],
  مدارک: ['مدارک مورد نیاز:\n• پاسپورت معتبر (بیش از ۶ ماه اعتبار)\n• تذکره برقی\n• عکس پرسنلی\n• مدارک تحصیلی (اختیاری)'],
  پناهندگی: ['ما در زمینه پرونده‌های پناهندگی و حقوق بشری تخصص داریم. لطفاً فرم مربوطه را پر کنید یا با ما تماس بگیرید.'],
  قرار: ['برای رزرو قرار ملاقات روی دکمه زیر کلیک کنید.'],
  وقت: ['برای اخذ وقت ملاقات روی دکمه زیر کلیک کنید.'],
};

const DEFAULT_REPLY = ['متشکرم از سوال شما! برای راهنمایی بهتر، لطفاً با واتساپ ما تماس بگیرید: +989012055578'];
const QUICK_REPLIES = ['ویزا', 'قیمت', 'آدرس', 'مدارک', 'تماس', 'قرار ملاقات'];

function getTime() {
  return new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

interface ChatWidgetProps {
  onAppointmentClick: () => void;
}

export function ChatWidget({ onAppointmentClick }: ChatWidgetProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', from: 'bot', text: 'سلام! به خدمات آنلاین میتا خوش آمدید. چطور می‌توانم کمک کنم؟', time: getTime() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [responses, setResponses] = useState<ChatResponse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowNotif(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=chatbot_responses`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResponses(data.filter((r: ChatResponse) => r.is_active === 'true' || r.is_active === true));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getReply = (text: string): { replies: string[]; hasAction: boolean; actionType?: 'appointment' } => {
    const lower = text.toLowerCase();

    // Check for address/appointment keywords
    if (lower.includes('آدرس') || lower.includes('قرار') || lower.includes('وقت') || lower.includes('ملاقات') || lower.includes('appointment')) {
      return {
        replies: [t('addressResponse')],
        hasAction: true,
        actionType: 'appointment'
      };
    }

    // Check SheetDB responses first
    for (const r of responses) {
      if (lower.includes(r.keyword.toLowerCase())) {
        return { replies: [r.response], hasAction: false };
      }
    }

    // Fall back to default responses
    for (const key of Object.keys(DEFAULT_RESPONSES)) {
      if (lower.includes(key)) {
        return { replies: DEFAULT_RESPONSES[key], hasAction: false };
      }
    }

    return { replies: DEFAULT_REPLY, hasAction: false };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowNotif(false);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

    const { replies, hasAction, actionType } = getReply(text);
    setTyping(false);
    replies.forEach((reply, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + i,
          from: 'bot',
          text: reply,
          time: getTime(),
          hasAction,
          actionType,
        }]);
      }, i * 300);
    });
  };

  const handleActionClick = () => {
    if (onAppointmentClick) {
      onAppointmentClick();
      setOpen(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {showNotif && !open && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl rounded-bl-none px-4 py-3 max-w-[200px] animate-slide-up">
            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">چطور می‌توانم کمک کنم؟</p>
            <button onClick={() => setShowNotif(false)} className="text-xs text-slate-400 mt-1 hover:text-slate-600">بستن</button>
          </div>
        )}

        <button
          onClick={() => { setOpen(!open); setShowNotif(false); }}
          className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-xl flex items-center justify-center text-white animate-zoom-pulse hover:scale-110 transition-transform duration-300 group"
          title="پشتیبانی آنلاین"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping-slow opacity-60" />
          {open ? <X className="w-6 h-6 relative z-10" /> : <Bot className="w-6 h-6 relative z-10" />}
          {!open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold">1</span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[calc(100vw-3rem)] max-w-sm animate-slide-up">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col" style={{ height: 480 }}>
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-500 to-emerald-600 p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 rounded-full border-2 border-emerald-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">دستیار میتا</p>
                <p className="text-emerald-100 text-xs">آنلاین · پاسخ فوری</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${msg.from === 'bot' ? 'bg-emerald-500' : 'bg-gold-400'}`}>
                    {msg.from === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4 text-slate-900" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.from === 'bot' ? 'text-right' : 'text-right'}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      msg.from === 'bot'
                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                        : 'bg-gold-400 text-slate-900 rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-1 opacity-60 ${msg.from === 'user' ? 'text-left' : 'text-right'}`}>{msg.time}</p>

                    {/* Action Button (for appointment) */}
                    {msg.hasAction && msg.actionType === 'appointment' && (
                      <button
                        onClick={handleActionClick}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors w-full justify-center"
                      >
                        <Calendar className="w-4 h-4" />
                        {t('bookAppointment')}
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white bg-emerald-500">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-700 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={() => sendMessage(input)} disabled={!input.trim()} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
