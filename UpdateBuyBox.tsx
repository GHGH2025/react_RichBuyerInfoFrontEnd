import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Mail, PhoneCall, ArrowRight, AlertCircle, CheckCircle2, Sun, Moon } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (v: string) => (v || '').trim().toLowerCase();

const normalizeUsPhone = (digitsOnly: string) => {
  const d = (digitsOnly || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) return d.slice(1);
  return d;
};

const isValidUsPhone = (digitsOnly: string) => normalizeUsPhone(digitsOnly).length === 10;

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (process as any).env?.REACT_APP_API_BASE_URL ||
  '';

const SENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const UpdateBuyBox: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState('');
  const [sentAt, setSentAt] = useState<number | null>(null);

  const emailNorm = useMemo(() => normalizeEmail(email), [email]);
  const phone10 = useMemo(() => normalizeUsPhone(phone), [phone]);

  const emailOk = useMemo(() => EMAIL_REGEX.test(emailNorm), [emailNorm]);
  const phoneOk = useMemo(() => phone10.length === 10, [phone10]);

  // key is tied to the specific email+phone combo
  const sentStorageKey = useMemo(() => {
    if (!emailOk || !phoneOk) return '';
    return `wdf_update_link_sent:${emailNorm}:${phone10}`;
  }, [emailOk, phoneOk, emailNorm, phone10]);

  // load any prior "sent" flag for this email+phone
  useEffect(() => {
    if (!sentStorageKey) {
      setSentAt(null);
      return;
    }

    try {
      const raw = localStorage.getItem(sentStorageKey);
      const t = raw ? Number(raw) : NaN;

      if (!t || Number.isNaN(t)) {
        setSentAt(null);
        return;
      }

      // expire it
      if (Date.now() - t > SENT_TTL_MS) {
        localStorage.removeItem(sentStorageKey);
        setSentAt(null);
        return;
      }

      setSentAt(t);
    } catch {
      setSentAt(null);
    }
  }, [sentStorageKey]);

  const sentForThisPair = !!sentAt;
  const canSend = emailOk && phoneOk && !isSending && !sentForThisPair;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    setIsSending(true);
    setError('');

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/api/buyer-submissions/update/request-link`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm, phone: phone10 }),
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const j = await res.json();
          msg = j?.detail || j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const now = Date.now();
      setSentAt(now);

      // persist "sent" so user can't spam clicks / quick reloads
      if (sentStorageKey) {
        try {
          localStorage.setItem(sentStorageKey, String(now));
        } catch {}
      }
    } catch (e: any) {
      setError(e?.message || 'No profile found. Please double-check email and phone.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-[#FBFBFF]'} transition-colors duration-500 pb-20`}>
        <nav
          className={`sticky top-0 z-50 w-full px-8 py-6 border-b ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-100'
          } backdrop-blur-xl`}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-4 ring-blue-600/10">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  WholesaleDealFinder.Ai
                </h1>
                <p className={`text-[10px] uppercase font-black tracking-[0.35em] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Update My Buy Box
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border-2 transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-800 text-slate-200'
                  : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 shadow-sm'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-16">
          <div
            className={`rounded-[3rem] p-10 md:p-12 shadow-2xl border-2 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Get Your Update Link
            </h2>
            <p className={`mt-4 text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Enter the same email and phone number you used when submitting your profile.
              We’ll email you a secure link to open your saved Buy Box and edit it.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-8">
              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <Mail size={12} className="text-blue-600" /> Email*
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                  }`}
                />
              </div>

              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <PhoneCall size={12} className="text-blue-600" /> Phone*
                </label>
                <input
                  required
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Digits only (e.g. 3055550123)"
                  className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none focus:ring-4 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-blue-600/10 focus:border-blue-200 focus:bg-white'
                  }`}
                />
              </div>

              <button
                disabled={!canSend}
                type="submit"
                className={`group w-full py-7 px-10 rounded-[2rem] text-xl font-black uppercase tracking-[0.25em] transition-all shadow-2xl flex items-center justify-center gap-5 active:scale-95 ${
                  canSend
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40'
                    : 'bg-white dark:bg-slate-900 text-blue-600/30 dark:text-slate-700 border-2 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-80'
                }`}
              >
                <span>
                  {sentForThisPair ? 'Email Sent' : isSending ? 'Sending...' : 'Get Link via Email'}
                </span>
                <ArrowRight
                  className={`w-7 h-7 transition-transform group-hover:translate-x-2 ${
                    !canSend || sentForThisPair ? 'opacity-10' : ''
                  }`}
                />
              </button>

              {error && (
                <div className="px-8 py-5 rounded-[2rem] bg-rose-600/10 border border-rose-600/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} className={isDarkMode ? 'text-rose-300' : 'text-rose-700'} />
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                      Request failed
                    </p>
                  </div>
                  <p className={`text-[11px] font-bold mt-2 ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
                    {error}
                  </p>
                </div>
              )}

              {sentForThisPair && (
                <div className="px-8 py-5 rounded-[2rem] bg-emerald-600/10 border border-emerald-600/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} />
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Email sent
                    </p>
                  </div>
                  <p className={`text-[11px] font-bold mt-2 ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-700/80'}`}>
                    Check your inbox. The link expires in 24 hours.
                  </p>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateBuyBox;