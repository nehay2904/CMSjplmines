import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Ico = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const MODULES = [
  {
    label: 'Compliance Matrix',
    sub: 'A complete, law-wise breakdown of every statutory obligation applicable across mine sites ',
    icon: <Ico><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></Ico>,
  },
  {
    label: 'Calendar & Alerts',
    sub: 'Every deadline is scheduled automatically and surfaced well ahead of time, with reminders that escalate as a due date approaches.',
    icon: <Ico><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></Ico>,
  },
  {
    label: 'Task Hierarchy',
    sub: 'Obligations break down into a three-level structure of task, sub-task, and action item, each assigned to a named user',
    icon: <Ico><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Ico>,
  },
  {
    label: 'Records & Reporting',
    sub: 'Supporting documents and evidence are linked directly from Drive against each obligation.',
    icon: <Ico><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /><path d="M9 13h6" /><path d="M9 17h6" /></Ico>,
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, homeFor } = useAuth();
  const navigate = useNavigate();

  // Already signed in — skip the login form.
  useEffect(() => {
    if (user) navigate(homeFor(user.role), { replace: true });
  }, [user, navigate, homeFor]);

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
    <div className="h-screen overflow-hidden flex bg-white">
      {/* LEFT — brand panel (60%), blue */}
      <div
        className="hidden lg:flex lg:w-[60%] h-full flex-col justify-center px-12 xl:px-16 py-8"
        style={{ backgroundColor: '#1E40AF' }}
      >
        <div className="w-full">
          <div className="flex items-center gap-5 mb-2">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1E40AF"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white leading-none tracking-tight">CompliTrack</h1>
          </div>
          <p className="text-blue-200 text-2xl font-medium tracking-tight mb-5 ml-[5rem]">
            Compliance Management System for JPL Mines
          </p>

          <p className="text-blue-100/80 text-sm leading-relaxed mb-6 max-w-2xl">
            Built for JPL Mines to bring every statutory obligation under one roof, replacing scattered
            registers with a single system of record that management can trust.
          </p>

          <div className="space-y-3.5 border-t border-white/15 pt-5">
            {MODULES.map((m) => (
              <div key={m.label} className="flex items-start gap-4">
                <span className="text-blue-200 mt-0.5 flex-shrink-0">{m.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight mb-0.5">{m.label}</p>
                  <p className="text-blue-200/75 text-xs leading-snug max-w-xl">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — sign-in panel (40%), light blue */}
      <div
        className="w-full lg:w-[40%] h-full flex items-center justify-center px-6 py-8"
        style={{ backgroundColor: '#EFF4FB' }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-semibold text-gray-900">CompliTrack</h1>
            <p className="text-gray-500 text-sm mt-1">Compliance Management System — JPL Mines</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in</h2>
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
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] text-sm"
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
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1A3690] disabled:opacity-60 text-white font-medium rounded-md transition text-sm mt-2"
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