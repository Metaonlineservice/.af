import React, { useState, useEffect } from 'react';
import {
  Shield, Users, FileText, RefreshCw, LogOut, Settings, Bot, Star,
  CheckCircle, Clock, XCircle, Eye, ChevronUp, Plus, Trash2, Edit, Save, X,
  Send, AlertTriangle, Globe
} from 'lucide-react';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Submission {
  id: string; created_at: string; first_name: string; last_name: string;
  passport_number: string; email: string; whatsapp: string; country: string;
  form_type: string; appointment_date: string; status: string;
  case_type: string; province: string; father_name: string;
}

interface ChatResponse {
  id: string; keyword: string; response: string; is_active: string;
}

interface Review {
  id: string; name: string; rating: string; comment: string; country: string; form_type: string; approved: string;
}

interface Service {
  id: string; title_fa: string; description: string; price: string; icon: string; is_active: string;
}

interface AdminPanelProps { onClose: () => void; }

type AdminTab = 'applications' | 'services' | 'chatbot' | 'reviews' | 'emergency' | 'settings';

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending: { label: 'در انتظار', cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'تأیید شده', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'رد شده', cls: 'bg-red-100 text-red-700' },
};

const FORM_LABELS: Record<string, string> = {
  australia: '🇦🇺 استرالیا', germany: '🇩🇪 آلمان', italy: '🇮🇹 ایتالیا',
  switzerland: '🇨🇭 سوئیس', france: '🇫🇷 فرانسه', canada: '🇨🇦 کانادا',
};

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>('applications');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [chatResponses, setChatResponses] = useState<ChatResponse[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch applications
      const subRes = await fetch(SHEETDB_API);
      const subData = await subRes.json();
      if (Array.isArray(subData)) setSubmissions(subData.reverse());

      // Fetch emergencies
      const emgRes = await fetch(`${SHEETDB_API}?sheet=emergency`);
      const emgData = await emgRes.json();
      if (Array.isArray(emgData)) setEmergencies(emgData.reverse());

      // Fetch chatbot responses
      const chatRes = await fetch(`${SHEETDB_API}?sheet=chatbot_responses`);
      const chatData = await chatRes.json();
      if (Array.isArray(chatData)) setChatResponses(chatData);

      // Fetch reviews
      const revRes = await fetch(`${SHEETDB_API}?sheet=reviews`);
      const revData = await revRes.json();
      if (Array.isArray(revData)) setReviews(revData);

      // Fetch services
      const svcRes = await fetch(`${SHEETDB_API}?sheet=services`);
      const svcData = await svcRes.json();
      if (Array.isArray(svcData)) setServices(svcData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${SHEETDB_API}/id/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status } }),
      });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch {}
  };

  const updateReview = async (id: string, approved: string) => {
    try {
      await fetch(`${SHEETDB_API}/id/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { approved } }),
      });
      setReviews(r => r.map(x => x.id === id ? { ...x, approved } : x));
    } catch {}
  };

  const deleteItem = async (sheet: string, id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
      await fetch(`${SHEETDB_API}/id/${id}?sheet=${sheet}`, { method: 'DELETE' });
      if (sheet === 'chatbot_responses') setChatResponses(c => c.filter(x => x.id !== id));
      if (sheet === 'reviews') setReviews(r => r.filter(x => x.id !== id));
      if (sheet === 'services') setServices(s => s.filter(x => x.id !== id));
    } catch {}
  };

  const saveEdit = async (sheet: string) => {
    if (!editingId) return;
    try {
      await fetch(`${SHEETDB_API}/id/${editingId}?sheet=${sheet}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: editForm }),
      });
      fetchData();
      setEditingId(null);
      setEditForm({});
    } catch {}
  };

  const startEdit = (item: any) => { setEditingId(item.id); setEditForm(item); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const addChatResponse = async () => {
    const newResp = { id: 'CR-' + Date.now().toString(36).toUpperCase(), keyword: 'کلمه‌کلیدی', response: 'پاسخ جدید', is_active: 'true' };
    try {
      await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newResp], sheet: 'chatbot_responses' }),
      });
      fetchData();
    } catch {}
  };

  const addService = async () => {
    const newSvc = { id: 'SV-' + Date.now().toString(36).toUpperCase(), title_fa: 'خدمات جدید', description: 'توضیحات', price: 'قیمت', icon: '🌍', is_active: 'true' };
    try {
      await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newSvc], sheet: 'services' }),
      });
      fetchData();
    } catch {}
  };

  const filtered = submissions.filter(s => {
    const matchSearch = `${s.first_name} ${s.last_name} ${s.passport_number} ${s.email}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    emergency: emergencies.length,
    reviews: reviews.filter(r => r.approved !== 'true').length,
  };

  const TABS: [AdminTab, string, React.ReactNode][] = [
    ['applications', `درخواست‌ها (${stats.total})`, <FileText className="w-4 h-4" />],
    ['services', 'خدمات', <Globe className="w-4 h-4" />],
    ['chatbot', 'چت‌بات', <Bot className="w-4 h-4" />],
    ['reviews', `نظرات (${stats.reviews})`, <Star className="w-4 h-4" />],
    ['emergency', `اضطراری`, <AlertTriangle className="w-4 h-4" />],
    ['settings', 'تنظیمات', <Settings className="w-4 h-4" />],
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900" dir="rtl">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-400/20 rounded-lg"><Shield className="w-6 h-6 text-gold-400" /></div>
            <div>
              <h1 className="text-lg font-bold">پنل مدیریت</h1>
              <p className="text-xs text-slate-400">Meta Online Service</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">صفحه اصلی</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[['کل درخواست', stats.total, FileText], ['در انتظار', stats.pending, Clock], ['تأیید شده', stats.approved, CheckCircle], ['نظرات جدید', stats.reviews, Star], ['اضطراری', stats.emergency, AlertTriangle]].map(([l, v, I], i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow flex items-center gap-3">
              <div className="p-2 bg-gold-400/10 rounded-lg"><I className="w-5 h-5 text-gold-400" /></div>
              <div><p className="text-xl font-bold">{v}</p><p className="text-xs text-slate-500">{l}</p></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border shadow overflow-x-auto">
          {TABS.map(([key, lbl, icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>
              {icon}{lbl}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
            <div className="p-4 flex gap-4 border-b">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
                className="flex-1 px-4 py-2 border rounded-lg text-sm" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
                <option value="all">همه</option>
                <option value="pending">در انتظار</option>
                <option value="approved">تأیید شده</option>
              </select>
            </div>
            {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gold-400 rounded-full animate-spin" /></div> : (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>{['#', 'نام', 'پاسپورت', 'نوع', 'وضعیت', 'اقدام'].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((sub, idx) => {
                    const isExp = expandedRow === sub.id;
                    const st = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                    return (
                      <React.Fragment key={sub.id}>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-3"><p className="font-medium text-sm">{sub.first_name} {sub.last_name}</p><p className="text-xs text-slate-400">{sub.email}</p></td>
                          <td className="px-4 py-3 text-sm font-mono">{sub.passport_number}</td>
                          <td className="px-4 py-3 text-sm">{FORM_LABELS[sub.form_type] || sub.form_type}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${st.cls}`}>{st.label}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setExpandedRow(isExp ? null : sub.id)} className="p-1.5 rounded-lg bg-slate-100">{isExp ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                              <select value={sub.status} onChange={e => updateStatus(sub.id, e.target.value)} className="text-xs bg-slate-100 border rounded-lg px-2 py-1">
                                <option value="pending">در انتظار</option>
                                <option value="approved">تأیید</option>
                                <option value="rejected">رد</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                        {isExp && (
                          <tr className="bg-slate-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                {[['فاکتور', sub.id], ['واتساپ', sub.whatsapp], ['کشور', sub.country], ['ثبت', sub.created_at ? new Date(sub.created_at).toLocaleDateString('fa-IR') : '—']].map(([l, v]) => (
                                  <div key={l as string} className="bg-white rounded-lg px-3 py-2">
                                    <p className="text-xs text-slate-400">{l as string}</p>
                                    <p className="font-medium">{v || '—'}</p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Services Tab */}
        {tab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={addService} className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-slate-900 font-medium rounded-lg"><Plus className="w-4 h-4" />افزودن</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <input value={editForm.title_fa || ''} onChange={e => setEditForm({ ...editForm, title_fa: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                      <input value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit('services')} className="p-2 text-emerald-600"><Save className="w-4 h-4" /></button>
                        <button onClick={cancelEdit} className="p-2 text-slate-500"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{s.icon}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${s.is_active === 'true' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{s.is_active === 'true' ? 'فعال' : 'غیرفعال'}</span>
                      </div>
                      <h4 className="font-bold mb-1">{s.title_fa}</h4>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{s.description}</p>
                      <p className="font-bold text-gold-500 mb-3">{s.price}</p>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('services', s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chatbot Tab */}
        {tab === 'chatbot' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={addChatResponse} className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-slate-900 font-medium rounded-lg"><Plus className="w-4 h-4" />افزودن پاسخ</button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>{['کلمه کلیدی', 'پاسخ', 'وضعیت', 'اقدام'].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {chatResponses.map(c => (
                    <tr key={c.id}>
                      <td className="px-4 py-3">
                        {editingId === c.id ? <input value={editForm.keyword || ''} onChange={e => setEditForm({ ...editForm, keyword: e.target.value })} className="px-3 py-1.5 border rounded-lg text-sm w-32" /> : <span className="font-medium">{c.keyword}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === c.id ? <textarea value={editForm.response || ''} onChange={e => setEditForm({ ...editForm, response: e.target.value })} className="px-3 py-1.5 border rounded-lg text-sm w-full" rows={2} /> : <span className="text-sm text-slate-500 line-clamp-2">{c.response}</span>}
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${c.is_active === 'true' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{c.is_active === 'true' ? 'فعال' : 'غیرفعال'}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {editingId === c.id ? (
                            <><button onClick={() => saveEdit('chatbot_responses')} className="p-2 text-emerald-600"><Save className="w-4 h-4" /></button><button onClick={cancelEdit} className="p-2 text-slate-500"><X className="w-4 h-4" /></button></>
                          ) : (
                            <><button onClick={() => startEdit(c)} className="p-2 text-blue-600"><Edit className="w-4 h-4" /></button><button onClick={() => deleteItem('chatbot_responses', c.id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button></>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === 'reviews' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>{['نام', 'امتیاز', 'نظر', 'وضعیت', 'اقدام'].map(h => <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td className="px-4 py-3"><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-slate-400">{r.country}</p></td>
                    <td className="px-4 py-3"><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < parseInt(r.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />)}</div></td>
                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{r.comment}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${r.approved === 'true' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.approved === 'true' ? 'تأیید' : 'در انتظار'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {r.approved !== 'true' && <button onClick={() => updateReview(r.id, 'true')} className="p-2 text-emerald-600 text-xs">تأیید</button>}
                        {r.approved === 'true' && <button onClick={() => updateReview(r.id, 'false')} className="p-2 text-amber-600 text-xs">رد</button>}
                        <button onClick={() => deleteItem('reviews', r.id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Emergency Tab */}
        {tab === 'emergency' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow">
            <div className="px-6 py-4 border-b flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /><h3 className="font-semibold">درخواست‌های اضطراری ({emergencies.length})</h3></div>
            <div className="divide-y">
              {emergencies.length === 0 ? <div className="text-center py-12 text-slate-400">بدون درخواست</div> : emergencies.map((e, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between mb-2">
                    <div><p className="font-semibold">{e.name}</p><p className="text-xs text-red-500">{e.emergency_type || e.emergencyType}</p></div>
                    <div className="text-left"><p className="text-sm font-mono">{e.phone}</p><p className="text-xs text-slate-400">{e.location}</p></div>
                  </div>
                  {e.description && <p className="text-sm text-slate-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h3 className="font-semibold mb-6">اطلاعات تماس</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="p-2 bg-gold-400/10 rounded-lg text-gold-400"><Send className="w-4 h-4" /></div>
                <div><p className="text-xs text-slate-500">واتساپ</p><p className="font-medium">+989012055578</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="p-2 bg-gold-400/10 rounded-lg text-gold-400"><Globe className="w-4 h-4" /></div>
                <div><p className="text-xs text-slate-500">آدرس</p><p className="font-medium">کابل، افغانستان</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
