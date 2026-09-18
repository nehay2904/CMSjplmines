import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const BLUE = '#1E40AF';
const GREEN = '#16A34A';
const ORANGE = '#F97316';
const PURPLE = '#9333EA';
const TEAL = '#0D9488';

const Ico = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const MODULES = [
  {
    label: 'Compliance Matrix',
    sub: 'A complete, law-wise breakdown of every statutory obligation applicable across mine sites ',
    color: GREEN,
    icon: <Ico><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></Ico>,
  },
  {
    label: 'Calendar & Alerts',
    sub: 'Every deadline is scheduled automatically and surfaced well ahead of time, with reminders that escalate as a due date approaches.',
    color: ORANGE,
    icon: <Ico><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></Ico>,
  },
  {
    label: 'Task Hierarchy',
    sub: 'Obligations break down into a three-level structure of task, sub-task, and action item, each assigned to a named user',
    color: PURPLE,
    icon: <Ico><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Ico>,
  },
  {
    label: 'Records & Reporting',
    sub: 'Supporting documents and evidence are linked directly from Drive against each obligation.',
    color: TEAL,
    icon: <Ico><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /><path d="M9 13h6" /><path d="M9 17h6" /></Ico>,
  },
];

const TICKER = [
  'Zero missed deadlines since rollout',
  '500+ statutory obligations tracked live',
  '15+ regulatory frameworks covered',
  'Escalation alerts, automatically scheduled',
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const { user, login, homeFor } = useAuth();
  const navigate = useNavigate();

  // Already signed in — skip the login form.
  useEffect(() => {
    if (user) navigate(homeFor(user.role), { replace: true });
  }, [user, navigate, homeFor]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % TICKER.length), 3200);
    return () => clearInterval(id);
  }, []);

  // ---- AUTH LOGIC — UNTOUCHED ----
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
  // --------------------------------

  return (
    <div className="h-screen overflow-hidden flex bg-white" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Scoped animation + font styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .ct-heading { font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif; }
        @keyframes ct-float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes ct-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ct-orb {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(30px,-24px) scale(1.12); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ct-orb2 {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(-34px,26px) scale(1.15); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ct-orb3 {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(20px,30px) scale(1.2); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes ct-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ct-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ct-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes ct-shine {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(240%); }
          100% { transform: translateX(240%); }
        }
        @keyframes ct-drift {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes ct-gradmove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ct-particle {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: .8; }
          90%  { opacity: .6; }
          100% { transform: translateY(-140px) translateX(var(--dx, 12px)); opacity: 0; }
        }
        @keyframes ct-wave {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ct-pop {
          0%   { transform: scale(.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ct-fadeup { animation: ct-fadeup .7s cubic-bezier(.22,1,.36,1) both; }
        .ct-float  { animation: ct-float 4.5s ease-in-out infinite; }
        .ct-spin-slow { animation: ct-spin 14s linear infinite; }
        .ct-bar span { transform-origin: left; animation: ct-grow .8s cubic-bezier(.22,1,.36,1) both; }
        .ct-btn { position: relative; overflow: hidden; background-size: 200% auto; animation: ct-gradmove 4s ease infinite; }
        .ct-btn::after {
          content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-120%);
        }
        .ct-btn:hover::after { animation: ct-shine 1.1s ease; }
        .ct-btn:hover { transform: translateY(-1px); }
        .ct-input { transition: box-shadow .25s, border-color .25s, transform .2s; }
        .ct-input:focus { transform: translateY(-1px); }
        .ct-dots {
          background-image: radial-gradient(rgba(255,255,255,.14) 1.2px, transparent 1.2px);
          background-size: 22px 22px;
          animation: ct-drift 8s linear infinite;
        }
        .ct-particle {
          position: absolute; bottom: -10px; border-radius: 9999px; pointer-events: none;
          animation: ct-particle linear infinite;
        }
        .ct-wave-wrap { overflow: hidden; line-height: 0; }
        .ct-wave { animation: ct-wave 9s linear infinite; width: 200%; display: block; }
        .ct-tick { animation: ct-fadein .5s ease both; }
        .ct-chip { animation: ct-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .ct-module-icon { transition: transform .3s, box-shadow .3s; }
        .group:hover .ct-module-icon { transform: scale(1.12) rotate(-6deg); }
        @media (prefers-reduced-motion: reduce) {
          .ct-fadeup,.ct-float,.ct-spin-slow,.ct-bar span,.ct-btn,.ct-btn::after,.ct-dots,.ct-particle,.ct-wave,.ct-tick,.ct-chip,.ct-module-icon { animation: none !important; }
        }
      `}</style>

      {/* LEFT — brand panel (60%), blue base + multi-color accents */}
      <div
        className="hidden lg:flex lg:w-[60%] h-full flex-col justify-center px-12 xl:px-16 py-8 relative overflow-hidden"
        style={{ backgroundColor: BLUE }}
      >
        {/* animated depth: dots + 3 drifting colored orbs (blue/purple/teal) */}
        <div className="absolute inset-0 ct-dots opacity-50 pointer-events-none" />
        <div className="absolute -top-28 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: '#60A5FA', animation: 'ct-orb 10s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: PURPLE, animation: 'ct-orb2 12s ease-in-out infinite' }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-[0.14] pointer-events-none"
          style={{ background: TEAL, animation: 'ct-orb3 13s ease-in-out infinite' }} />

        {/* floating particles in brand colors */}
        {[
          { left: '8%', size: 6, color: ORANGE, dur: '7s', delay: '0s', dx: '10px' },
          { left: '22%', size: 4, color: GREEN, dur: '9s', delay: '1.2s', dx: '-14px' },
          { left: '40%', size: 5, color: TEAL, dur: '8s', delay: '2.4s', dx: '8px' },
          { left: '58%', size: 4, color: PURPLE, dur: '10s', delay: '.6s', dx: '-10px' },
          { left: '74%', size: 6, color: ORANGE, dur: '7.5s', delay: '3s', dx: '12px' },
          { left: '88%', size: 4, color: GREEN, dur: '9.5s', delay: '1.8s', dx: '-8px' },
        ].map((p, i) => (
          <span key={i} className="ct-particle" style={{
            left: p.left, width: p.size, height: p.size, backgroundColor: p.color,
            animationDuration: p.dur, animationDelay: p.delay, '--dx': p.dx,
          }} />
        ))}

        <div className="w-full relative z-10">
          <div className="flex items-center gap-5 mb-2">
            {/* Logo mark: rotating multi-color ring + blue shield + GREEN check + ORANGE badge */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="absolute -inset-2 ct-spin-slow" width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="37" fill="none" strokeWidth="2.5"
                  stroke="url(#ct-ring-grad)" strokeDasharray="60 30 40 55" strokeLinecap="round" />
                <defs>
                  <linearGradient id="ct-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ORANGE} />
                    <stop offset="33%" stopColor={GREEN} />
                    <stop offset="66%" stopColor={TEAL} />
                    <stop offset="100%" stopColor={PURPLE} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ct-float w-16 h-16 rounded-xl bg-white flex items-center justify-center relative shadow-lg">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    stroke={BLUE} />
                  <path d="m9 12 2 2 4-4" stroke={GREEN} />
                </svg>
                {/* orange pulse badge */}
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
                    style={{ backgroundColor: ORANGE }} />
                  <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white"
                    style={{ backgroundColor: ORANGE }} />
                </span>
              </div>
            </div>
            <h1 className="ct-heading text-5xl font-bold text-white leading-none tracking-tight">CompliTrack</h1>
          </div>

          <p className="text-blue-200 text-2xl font-medium tracking-tight mb-3 ml-[5rem]">
            Compliance Management System for JPL Mines
          </p>

          {/* four-color accent bar */}
          <div className="ct-bar flex items-center gap-1.5 mb-4 ml-[5rem]">
            <span className="h-1 w-10 rounded-full" style={{ backgroundColor: '#93C5FD', animationDelay: '.05s' }} />
            <span className="h-1 w-7 rounded-full" style={{ backgroundColor: GREEN, animationDelay: '.15s' }} />
            <span className="h-1 w-7 rounded-full" style={{ backgroundColor: ORANGE, animationDelay: '.25s' }} />
            <span className="h-1 w-7 rounded-full" style={{ backgroundColor: TEAL, animationDelay: '.35s' }} />
            <span className="h-1 w-5 rounded-full" style={{ backgroundColor: PURPLE, animationDelay: '.45s' }} />
          </div>

          {/* rotating live ticker chip */}
          <div className="ml-[5rem] mb-5 h-6">
            <div key={tick} className="ct-tick inline-flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: [GREEN, ORANGE, TEAL, PURPLE][tick % 4] }} />
              {TICKER[tick]}
            </div>
          </div>

          <p className="text-blue-100/80 text-sm leading-relaxed mb-6 max-w-2xl ct-fadeup" style={{ animationDelay: '.1s' }}>
            Built for JPL Mines to bring every statutory obligation under one roof, replacing scattered
            registers with a single system of record that management can trust.
          </p>

          <div className="space-y-3.5 border-t border-white/15 pt-5">
            {MODULES.map((m, i) => (
              <div key={m.label}
                className="flex items-start gap-4 ct-fadeup group"
                style={{ animationDelay: `${0.18 + i * 0.09}s` }}>
                <span className="ct-module-icon flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${m.color}26`, color: m.color }}>
                  {m.icon}
                </span>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight mb-0.5">{m.label}</p>
                  <p className="text-blue-200/75 text-xs leading-snug max-w-xl">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* animated wave divider along the bottom edge, multi-color */}
        <div className="ct-wave-wrap absolute bottom-0 left-0 right-0 opacity-70">
          <svg className="ct-wave" viewBox="0 0 200 16" preserveAspectRatio="none" height="16">
            <path d="M0 8 Q 12.5 0 25 8 T 50 8 T 75 8 T 100 8 T 125 8 T 150 8 T 175 8 T 200 8"
              fill="none" stroke="url(#ct-wave-grad)" strokeWidth="2" />
            <path d="M100 8 Q 112.5 0 125 8 T 150 8 T 175 8 T 200 8 T 225 8 T 250 8 T 275 8 T 300 8"
              fill="none" stroke="url(#ct-wave-grad)" strokeWidth="2" />
            <defs>
              <linearGradient id="ct-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={ORANGE} />
                <stop offset="33%" stopColor={GREEN} />
                <stop offset="66%" stopColor={TEAL} />
                <stop offset="100%" stopColor={PURPLE} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* RIGHT — sign-in panel (40%), light blue */}
      <div
        className="w-full lg:w-[40%] h-full flex items-center justify-center px-6 py-8 relative overflow-hidden"
        style={{ backgroundColor: '#EFF4FB' }}
      >
        {/* faint colored corner blobs on the right panel too */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: TEAL }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: ORANGE }} />

        <div className="w-full max-w-sm ct-fadeup relative z-10" style={{ animationDelay: '.12s' }}>
          <div className="text-center mb-8 lg:hidden">
            <h1 className="ct-heading text-2xl font-semibold text-gray-900">CompliTrack</h1>
            <p className="text-gray-500 text-sm mt-1">Compliance Management System — JPL Mines</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 relative overflow-hidden">
            {/* four-color top accent (distinct segments) */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <span className="flex-1" style={{ backgroundColor: BLUE }} />
              <span className="w-1/5" style={{ backgroundColor: GREEN }} />
              <span className="w-1/6" style={{ backgroundColor: ORANGE }} />
              <span className="w-1/6" style={{ backgroundColor: TEAL }} />
              <span className="w-[10%]" style={{ backgroundColor: PURPLE }} />
            </div>
            <div className="ct-chip inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${GREEN}1A`, color: GREEN }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
              Secure role-based access
            </div>
            <h2 className="ct-heading text-xl font-semibold text-gray-900 mb-1">Sign in</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your credentials to access your account</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@jindalpower.com"
                  className="ct-input w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="ct-input w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="ct-btn w-full py-2.5 text-white font-medium rounded-md transition text-sm mt-2 disabled:opacity-60"
                style={{ backgroundImage: `linear-gradient(90deg, ${BLUE}, ${TEAL}, ${BLUE})` }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">© 2026 JPL Mines. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;