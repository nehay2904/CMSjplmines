import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react';
import API from '../../api/axios';
import { StatCard, Spinner, PageHeader, inputCls } from '../../components/ui';

const DONUT_COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#64748b'];

function CategoryDonut({ byCategory, total }) {
  if (!byCategory?.length || !total) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }

  const size = 160;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let offsetAcc = 0;
  const segments = byCategory.map((row, i) => {
    const pct = row.count / total;
    const dash = pct * circumference;
    const seg = {
      id: row._id,
      count: row.count,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -offsetAcc,
    };
    offsetAcc += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 flex-shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        {segments.map((s) => (
          <circle
            key={s.id}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={s.dasharray}
            strokeDashoffset={s.dashoffset}
          />
        ))}
      </svg>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600">{s.id}</span>
            <span className="font-medium text-slate-900">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminActivity({ logs, loading }) {
  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (!logs?.length) return <p className="text-sm text-slate-400">No recent activity.</p>;

  return (
    <div className="space-y-3">
      {logs.map((log, i) => (
        <div key={log._id || i} className="flex items-start justify-between gap-3 text-sm">
          <div>
            <p className="font-medium text-slate-900">{log.user || log.actor || 'Admin'}</p>
            <p className="text-slate-500">
              {log.action || 'Updated'} · {log.item || log.target || '—'}
            </p>
          </div>
          <span className="whitespace-nowrap text-xs text-slate-400">
            {log.when || (log.createdAt ? new Date(log.createdAt).toLocaleString() : '—')}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Overview() {
  const [mines, setMines] = useState([]);
  const [mine, setMine] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    API.get('/mines').then((r) => setMines(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    API.get('/compliances/stats', { params: mine ? { mine } : {} })
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [mine]);

  useEffect(() => {
    setActivityLoading(true);
    API.get('/audit-logs', { params: { limit: 5 } })
      .then((r) => setActivity(r.data))
      .catch(() => setActivity([]))
      .finally(() => setActivityLoading(false));
  }, []);

  const s = data?.stats || {};

  return (
    <>
      <PageHeader
        title="Overview"
        actions={
          <select
            value={mine}
            onChange={(e) => setMine(e.target.value)}
            className={`${inputCls} w-auto`}
          >
            <option value="">All mines</option>
            {mines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Total" value={s.total || 0} icon={ClipboardList} accent="indigo" />
            <StatCard label="Pending" value={s.Pending || 0} icon={Clock} accent="slate" />
            <StatCard label="Upcoming" value={s.Upcoming || 0} icon={CalendarClock} accent="sky" />
            <StatCard label="Overdue" value={s.Overdue || 0} icon={AlertTriangle} accent="rose" />
            <StatCard
              label="Completed"
              value={s.Completed || 0}
              icon={CheckCircle2}
              accent="emerald"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900">By regulatory category</h3>
              <div className="mt-4">
                <CategoryDonut byCategory={data?.byCategory} total={s.total} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900">Recent admin activity</h3>
              <div className="mt-4">
                <AdminActivity logs={activity} loading={activityLoading} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}