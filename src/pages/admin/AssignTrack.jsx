import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Search, X } from 'lucide-react';
import API from '../../api/axios';
import ComplianceTable from '../../components/ComplianceTable';
import { Modal, Field, inputCls, Spinner, PageHeader } from '../../components/ui';

export default function AssignTrack() {
  const [rows, setRows] = useState([]);
  const [mines, setMines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mine: '', status: '', search: '' });
  const [assign, setAssign] = useState(null);
  const [picked, setPicked] = useState([]); // array of user IDs
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

  const eligible = (c) => {
    const mineIds = (c.mines || []).map((m) => String(m._id || m));
    return users.filter(
      (u) => u.role !== 'admin' && mineIds.includes(String(u.mine?._id || u.mine))
    );
  };

  const openAssign = (c) => {
    setAssign(c);
    setPicked((c.assignedTo || []).map((u) => u._id || u));
  };

  const toggleUser = (uid) => {
    setPicked((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const doAssign = async (e) => {
    e.preventDefault();
    if (!picked.length) return toast.error('Select at least one user');
    setSaving(true);
    try {
      await API.patch(`/compliances/${assign._id}/assign`, { assignedTo: picked });
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
        subtitle="Assign one or more people to each compliance"
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
            <option key={m._id} value={m._id}>{m.name}</option>
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
              {c.assignedTo?.length ? 'Reassign' : 'Assign'}
            </button>
          )}
        />
      )}

      <Modal open={!!assign} onClose={() => setAssign(null)} title="Assign compliance" maxWidth="max-w-lg">
        {assign && (
          <form onSubmit={doAssign} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{assign.title}</p>
              <p className="text-slate-500">
                {assign.category} · {(assign.mines || []).map((m) => m.name).join(', ')}
              </p>
            </div>

            <Field label="Assign to (select one or more)">
              <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
                {eligible(assign).length === 0 ? (
                  <p className="px-3 py-4 text-sm text-amber-600">
                    No users in this mine yet. Add them under Users & Team first.
                  </p>
                ) : (
                  eligible(assign).map((u) => (
                    <label
                      key={u._id}
                      className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={picked.includes(u._id)}
                        onChange={() => toggleUser(u._id)}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">
                          {u.role === 'supervisor' ? 'Team Lead' : 'Officer'}
                          {u.dept ? ` · ${u.dept}` : ''}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </Field>

            {picked.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {picked.map((id) => {
                  const u = users.find((u) => u._id === id);
                  return u ? (
                    <span
                      key={id}
                      className="flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700"
                    >
                      {u.name}
                      <button type="button" onClick={() => toggleUser(id)}>
                        <X size={12} />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
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
                {saving ? 'Assigning…' : `Assign (${picked.length})`}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}