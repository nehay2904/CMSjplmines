import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const GREEN = '#0F5132';
const GREEN_DARK = '#0A3D25';

const Ico = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const MODULES = [
  { label: 'Dashboard', sub: 'One-window view', icon: <Ico><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></Ico> },
  { label: 'Calendar Blocking', sub: 'Deadline scheduling', icon: <Ico><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /></Ico> },
  { label: 'Tasks', sub: '3-level hierarchy', icon: <Ico><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Ico> },
  { label: 'Compliance', sub: 'Law-wise matrix', icon: <Ico><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></Ico> },
  { label: 'Safety Meetings', sub: '3-step workflow', icon: <Ico><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ico> },
  { label: 'Alerts', sub: 'Automatic reminders', pulse: true, icon: <Ico><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ico> },
  { label: 'Records', sub: 'Drive-linked evidence', icon: <Ico><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /><path d="M9 13h6" /><path d="M9 17h6" /></Ico> },
  { label: 'Reports', sub: 'Status & performance', icon: <Ico><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></Ico> },
];

const useCountUp = (target, start, duration = 1400) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, duration]);

  return value;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const [now, setNow] = useState(new Date());
  const { user, login, homeFor } = useAuth();
  const navigate = useNavigate();

  // Already signed in — skip the login form.
  useEffect(() => {
    if (user) navigate(homeFor(user.role), { replace: true });
  }, [user, navigate, homeFor]);

  useEffect(() => {
    const t = setTimeout(() => setStatsStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const obligations = useCountUp(500, statsStarted, 1600);
  const frameworks = useCountUp(15, statsStarted, 1200);

  const istTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate(homeFor(data.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT — green hero panel (75%) */}
      <div
        className="hidden lg:flex lg:w-[75%] relative flex-col justify-center px-16 py-12 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${GREEN} 0%, ${GREEN_DARK} 100%)` }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white opacity-5" />

        <div className="relative z-10 max-w-3xl">
          {/* Logo mark + wordmark */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">CompliTrack</h1>
              <p className="text-green-200/80 text-[11px] tracking-wide mt-1">
                COMPLIANCE &amp; ALERT MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          <p className="text-green-100 text-[15px] leading-relaxed mb-8 max-w-2xl">
            A digitally-enabled compliance and alert management platform for JPL Mines.
            It gives management a single-window view of every statutory obligation and its
            control status through live dashboards — while equipping teams on the ground
            with a clear, law-wise matrix of what's due, when, and who owns it.
          </p>

          {/* Module grid */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {MODULES.map((m) => (
              <div key={m.label}
                className="relative flex flex-col items-center gap-1.5 bg-white/10 border border-white/10 rounded-xl py-4 px-2 hover:bg-white/[0.16] transition">
                {m.pulse && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                  </span>
                )}
                <span className="text-white">{m.icon}</span>
                <span className="text-white text-[12px] font-medium text-center leading-tight">{m.label}</span>
                <span className="text-green-200/70 text-[10px] text-center leading-tight">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Animated stats */}
          <div className="flex gap-10">
            <div>
              <p className="text-3xl font-bold text-white tabular-nums leading-none">{obligations}+</p>
              <p className="text-green-200/80 text-xs mt-1">statutory obligations tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tabular-nums leading-none">{frameworks}+</p>
              <p className="text-green-200/80 text-xs mt-1">regulatory frameworks covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tabular-nums leading-none">0</p>
              <p className="text-green-200/80 text-xs mt-1">missed deadlines, auto-alerted</p>
            </div>
          </div>
        </div>

        {/* Hero footer: live IST clock */}
        <div className="relative z-10 mt-12 flex items-center justify-end text-green-200/70 text-xs max-w-3xl">
          <span className="tabular-nums">IST · {istTime}</span>
        </div>
      </div>

      {/* RIGHT — login form (25%) */}
      <div className="w-full lg:w-[25%] bg-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-semibold text-gray-800">CompliTrack</h1>
            <p className="text-gray-500 text-sm mt-1">Compliance &amp; Alert Management — JPL Mines</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center">Sign in</h2>
            <p className="text-gray-400 text-xs text-center mb-6">Role-based secure access</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-sm"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F5132] hover:bg-[#0A3D25] disabled:opacity-60 text-white font-medium rounded-lg transition text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            {/*
              Removed the plaintext "Password: Jindal@123" credentials box that was here —
              this page is public, so anyone visiting the site could read it and log in.
              If you need a shared demo login while testing, share it privately with your
              team instead of printing it on the login screen.
            */}
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">© 2026 JPL Mines</p>
        </div>
      </div>
    </div>
  );
};

export default Login;