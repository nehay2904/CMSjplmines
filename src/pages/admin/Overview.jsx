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

export default function Overview() {
  const [mines, setMines] = useState([]);
  const [mine, setMine] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const s = data?.stats || {};

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Compliance health across all mines"
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
            <StatCard
              label="Due This Month"
              value={s['Due This Month'] || 0}
              icon={CalendarClock}
              accent="amber"
            />
            <StatCard label="Overdue" value={s.Overdue || 0} icon={AlertTriangle} accent="rose" />
            <StatCard
              label="Completed"
              value={s.Completed || 0}
              icon={CheckCircle2}
              accent="emerald"
            />
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">By regulatory category</h3>
            {data?.byCategory?.length ? (
              <div className="mt-4 space-y-3">
                {data.byCategory.map((row) => {
                  const pct = s.total ? Math.round((row.count / s.total) * 100) : 0;
                  return (
                    <div key={row._id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-600">{row._id}</span>
                        <span className="font-medium text-slate-900">{row.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No data yet.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
