import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Bell, Play } from 'lucide-react';
import API from '../api/axios';
import { Spinner, PageHeader, inputCls } from './ui';
import { useAuth } from '../context/AuthContext';

const TYPE_LABEL = {
  reminder: 'Reminder',
  'escalation-supervisor': 'Escalated → Team Lead',
  'escalation-admin': 'Escalated → Admin',
};
const TYPE_STYLE = {
  reminder: 'bg-sky-50 text-sky-700',
  'escalation-supervisor': 'bg-amber-50 text-amber-700',
  'escalation-admin': 'bg-rose-50 text-rose-700',
};
const fmt = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export default function AlertLogView() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [running, setRunning] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    API.get('/alertlogs', { params: type ? { alertType: type } : {} })
      .then((r) => setLogs(r.data))
      .catch(() => toast.error('Failed to load alerts'))
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => load(), [load]);

  const runNow = async () => {
    setRunning(true);
    try {
      await API.post('/alertlogs/run');
      toast.success('Scheduler run complete');
      load();
    } catch {
      toast.error('Run failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Alert Log"
        subtitle="Every reminder and escalation email sent by the system"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${inputCls} w-auto`}
            >
              <option value="">All types</option>
              <option value="reminder">Reminders</option>
              <option value="escalation-supervisor">Escalations → Team Lead</option>
              <option value="escalation-admin">Escalations → Admin</option>
            </select>
            {user?.role === 'admin' && (
              <button
                onClick={runNow}
                disabled={running}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                title="Manually trigger the daily alert job"
              >
                <Play size={15} />
                {running ? 'Running…' : 'Run now'}
              </button>
            )}
          </div>
        }
      />

      {loading ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Bell size={22} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">No alerts logged yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Reminders appear here once compliances approach their due dates.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Compliance</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Recipients</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((l) => (
                  <tr key={l._id}>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmt(l.sentAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          TYPE_STYLE[l.alertType] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {TYPE_LABEL[l.alertType] || l.alertType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {l.compliance?.title || l.complianceTitle || '—'}
                      </p>
                      <p className="text-xs text-slate-400">{l.compliance?.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {l.user?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {Array.isArray(l.sentTo) ? l.sentTo.join(', ') : l.sentTo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          l.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
