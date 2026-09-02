import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader2 } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, homeFor } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(homeFor(user.role), { replace: true });
  }, [user, navigate, homeFor]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}`);
      navigate(homeFor(data.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-indigo-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <ShieldCheck size={26} />
          <span className="text-lg font-semibold">CompliTrack</span>
        </div>
        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            Statutory compliance,<br />across every mine.
          </h1>
          <p className="mt-4 max-w-md text-indigo-100">
            Track returns, notices and records for all four sites. Automatic
            reminders and escalations keep nothing from slipping past its due date.
          </p>
        </div>
        <p className="text-sm text-indigo-200">
          JPL Mines — GP IV/1 · GP IV/2&amp;3 · GP Sector 1 · Banai-Banamunda
        </p>
      </div>

      {/* form panel */}
      <div className="flex w-full items-center justify-center bg-slate-50 p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2 text-indigo-700">
              <ShieldCheck size={24} />
              <span className="text-lg font-semibold">CompliTrack</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to access the compliance portal.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="you@jplmines.in"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Authorised personnel only. Contact your administrator for access.
          </p>
        </div>
      </div>
    </div>
  );
}
