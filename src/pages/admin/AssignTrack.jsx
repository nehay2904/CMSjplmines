import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Search } from 'lucide-react';
import API from '../../api/axios';
import ComplianceTable from '../../components/ComplianceTable';
import { Modal, Field, inputCls, Spinner, PageHeader } from '../../components/ui';

export default function AssignTrack() {
  const [rows, setRows] = useState([]);
  const [mines, setMines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mine: '', status: '', search: '' });
  const [assign, setAssign] = useState(null); // compliance being assigned
  const [pick, setPick] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/mines').then((r) => setMines(r.data)).catch(() => {});
    API.get('/users').then((r) => setUsers(r.data)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    API.get('/compliances', { params })
      .then((r) => setRows(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  // users belonging to the compliance's mine (admins are global, always eligible)
  const eligible = (c) => {
    const mineIds = (c.mines || []).map((m) => String(m._id || m));
    return users.filter(
      (u) =>
        u.role !== 'admin' &&
        mineIds.includes(String(u.mine?._id || u.mine))
    );
  };

  const openAssign = (c) => {
    setAssign(c);
    setPick(c.assignedTo?._id || '');
  };

  const doAssign = async (e) => {
    e.preventDefault();
    if (!pick) return toast.error('Pick a user');
    setSaving(true);
    try {
      await API.patch(`/compliances/${assign._id}/assign`, { assignedTo: pick });
      toast.success('Assigned');
      setAssign(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assign failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Assign & Track"
        subtitle="Give each compliance an owner and watch its status move"
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={filters.mine}
          onChange={(e) => setFilters({ ...filters, mine: e.target.value })}
          className={inputCls}
        >
          <option value="">All mines</option>
          {mines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={inputCls}
        >
          <option value="">All statuses</option>
          {['Pending', 'Upcoming', 'Due This Month', 'Overdue', 'Completed'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <ComplianceTable
          rows={rows}
          columns={['id', 'title', 'category', 'mine', 'assignee', 'due', 'status']}
          rowAction={(c) => (
            <button
              onClick={() => openAssign(c)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <UserPlus size={14} />
              {c.assignedTo ? 'Reassign' : 'Assign'}
            </button>
          )}
        />
      )}

      <Modal open={!!assign} onClose={() => setAssign(null)} title="Assign compliance">
        {assign && (
          <form onSubmit={doAssign} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{assign.title}</p>
              <p className="text-slate-500">
                {assign.category} · {(assign.mines || []).map((m) => m.name || m).join(', ')}
              </p>
            </div>
            <Field label="Assign to" required>
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className={inputCls}
                required
              >
                <option value="">Select a user</option>
                {eligible(assign).map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} — {u.role === 'supervisor' ? 'Team Lead' : 'Officer'}
                    {u.dept ? ` (${u.dept})` : ''}
                  </option>
                ))}
              </select>
            </Field>
            {eligible(assign).length === 0 && (
              <p className="text-xs text-amber-600">
                No users belong to this mine yet. Add one under Users & Team first.
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssign(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Assigning…' : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}