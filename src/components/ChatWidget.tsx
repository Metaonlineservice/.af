import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SHEETDB_API, SHEET_NAMES, CONTACT_INFO, getApiUrl } from '../config/apiConfig';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  time: string;
  hasAction?: boolean;
  actionType?: 'appointment' | 'whatsapp' | 'form';
  actionUrl?: string;
  actionLabel?: string;
}

interface ChatResponse {
  id: string;
  keyword: string;
  response: string;
  category?: string;
  priority?: string | number;
  language?: string;
  is_active: string;
}

const DEFAULT_REPLY = 'متشکرم از سوال شما! پاسخی یافت نشد. لطفاً با واتساپ ما تماس بگیرید:';

const QUICK_REPLIES = ['ویزا', 'قیمت', 'مدارک', 'تماس', 'آدرس', 'ساعت', 'قرار ملاقات', 'کمک'];

// Generate session ID
const getSessionId = () => {
  const stored = sessionStorage.getItem('chat_session_id');
  if (stored) return stored;
  const newId = 'CHAT-' + Date.now().toString(36).toUpperCase();
  sessionStorage.setItem('chat_session_id', newId);
  return newId;
};

const SESSION_ID = getSessionId();

function getTime() {
  return new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

// Get browser info
function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowNotif(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Load responses from Google Sheets
  useEffect(() => {
    fetch(`${getApiUrl()}?sheet=${SHEET_NAMES.CHATBOT}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load responses');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const activeResponses = data
            .filter((r: ChatResponse) => r.is_active === 'true' || r.is_active === true)
            .map((r: ChatResponse) => ({
              ...r,
              priority: typeof r.priority === 'string' ? parseInt(r.priority, 10) : r.priority || 0
            }))
            .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));
          setResponses(activeResponses);
          setLoaded(true);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getReply = (text: string): { reply: string; hasAction: boolean; actionType?: 'appointment' | 'whatsapp' | 'form'; actionUrl?: string; actionLabel?: string } => {
    const lower = text.toLowerCase().trim();

    // If responses are loaded, search through them
    if (responses.length > 0) {
      // Find all matching responses
      const matches = responses.filter(r =>
        lower.includes(r.keyword.toLowerCase()) ||
        r.keyword.toLowerCase().includes(lower)
      );

      if (matches.length > 0) {
        // Return the highest priority match (already sorted)
        const bestMatch = matches[0];

        // Check if this is appointment-related
        if (lower.includes('قرار') || lower.includes('وقت') || lower.includes('ملاقات') || lower.includes('appointment')) {
          return {
            reply: bestMatch.response,
            hasAction: true,
            actionType: 'appointment',
            actionLabel: 'رزرو قرار ملاقات'
          };
        }

        return {
          reply: bestMatch.response,
          hasAction: true,
          actionType: 'whatsapp',
          actionUrl: CONTACT_INFO.whatsappUrl,
          actionLabel: 'تماس با واتساپ'
        };
      }
    }

    // Default response with WhatsApp action
    return {
      reply: DEFAULT_REPLY,
      hasAction: true,
      actionType: 'whatsapp',
      actionUrl: CONTACT_INFO.whatsappUrl,
      actionLabel: 'تماس با واتساپ'
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowNotif(false);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

    const { reply, hasAction, actionType, actionUrl, actionLabel } = getReply(text);
    setTyping(false);

    const botMsg: Message = {
      id: Date.now().toString() + 'r',
      from: 'bot',
      text: reply,
      time: getTime(),
      hasAction,
      actionType,
      actionUrl,
      actionLabel,
    };

    setMessages(prev => [...prev, botMsg]);

    // Store conversation in Google Sheets
    try {
      const conversationRecord = {
        id: 'MSG-' + Date.now().toString(36).toUpperCase(),
        session_id: SESSION_ID,
        timestamp: new Date().toISOString(),
        user_message: text,
        bot_response: reply,
        browser: getBrowserInfo(),
        language: document.documentElement.lang || 'fa',
      };

      await fetch(`${getApiUrl()}?sheet=${SHEET_NAMES.CHATBOT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [conversationRecord] }),
      });
    } catch (err) {
      console.error('Failed to save chat:', err);
    }
  };

  const handleActionClick = (actionType?: string, actionUrl?: string) => {
    if (actionType === 'appointment') {
      onAppointmentClick();
      setOpen(false);
    } else if (actionType === 'whatsapp' && actionUrl) {
      window.open(actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Chat Button - Reduced Size by ~20% */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
        {showNotif && !open && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl rounded-bl-none px-3 py-2 max-w-[180px] animate-slide-up">
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">چطور می‌توانم کمک کنم؟</p>
            <button onClick={() => setShowNotif(false)} className="text-xs text-slate-400 mt-1 hover:text-slate-600">بستن</button>
          </div>
        )}

        <button
          onClick={() => { setOpen(!open); setShowNotif(false); }}
          className="relative w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white animate-zoom-pulse hover:scale-110 transition-transform duration-300 group"
          title="پشتیبانی آنلاین"
          aria-label="چت آنلاین"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping-slow opacity-50" />
          {open ? <X className="w-4 h-4 relative z-10" /> : <MessageCircle className="w-4 h-4 relative z-10" />}
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold">1</span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-16 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-slide-up">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col" style={{ height: 420 }}>
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-500 to-emerald-600 p-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-300 rounded-full border-2 border-emerald-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">دستیار میتا</p>
                <p className="text-emerald-100 text-xs">{loaded ? 'آنلاین · پاسخ فوری' : 'در حال بارگذاری...'}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="بستن">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50 dark:bg-slate-900/50" dir="rtl">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${msg.from === 'bot' ? 'bg-emerald-500' : 'bg-navy-700'}`}>
                    {msg.from === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.from === 'bot' ? 'text-right' : 'text-right'}`}>
                    <div className={`px-3 py-2 rounded-xl text-xs whitespace-pre-line ${
                      msg.from === 'bot'
                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                        : 'bg-navy-700 text-white rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[9px] mt-1 opacity-60 text-slate-500 dark:text-slate-400`}>{msg.time}</p>

                    {/* WhatsApp/Action Button */}
                    {msg.hasAction && msg.from === 'bot' && (
                      <button
                        onClick={() => handleActionClick(msg.actionType, msg.actionUrl)}
                        className={`mt-2 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors w-full ${
                          msg.actionType === 'appointment'
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {msg.actionType === 'appointment' ? (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{msg.actionLabel || t('bookAppointment')}</span>
                            <ArrowLeft className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <WhatsAppIcon />
                            <span>{msg.actionLabel || 'تماس با واتساپ'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white bg-emerald-500">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="bg-white dark:bg-slate-700 px-3 py-2 rounded-xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5" dir="rtl">
                {QUICK_REPLIES.slice(0, 6).map(q => (
                  <button key={q} onClick={() => sendMessage(q)} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-2.5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={() => sendMessage(input)} disabled={!input.trim()} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50" aria-label="ارسال">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
