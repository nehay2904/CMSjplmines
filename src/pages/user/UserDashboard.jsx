import { useEffect, useState } from 'react';
import { ClipboardList, AlertTriangle, CheckCircle2, CalendarClock } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatCard, Spinner, PageHeader } from '../../components/ui';
import ComplianceTable from '../../components/ComplianceTable';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [attention, setAttention] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/compliances/stats'),
      API.get('/compliances', { params: { status: 'Overdue' } }),
      API.get('/compliances', { params: { status: 'Due This Month' } }),
    ])
      .then(([s, overdue, due]) => {
        setStats(s.data.stats || {});
        setAttention([...overdue.data, ...due.data]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0] || ''}`}
        subtitle="Here's what's on your plate"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned to me" value={stats.total || 0} icon={ClipboardList} accent="indigo" />
        <StatCard
          label="Due This Month"
          value={stats['Due This Month'] || 0}
          icon={CalendarClock}
          accent="amber"
        />
        <StatCard label="Overdue" value={stats.Overdue || 0} icon={AlertTriangle} accent="rose" />
        <StatCard label="Completed" value={stats.Completed || 0} icon={CheckCircle2} accent="emerald" />
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Needs your attention</h3>
        <ComplianceTable rows={attention} columns={['title', 'category', 'due', 'status']} />
      </div>
    </>
  );
}
