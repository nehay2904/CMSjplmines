import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Power, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import { Modal, Field, inputCls, Spinner, PageHeader } from '../../components/ui';

const DEPTS = [
  'Safety',
  'Explosive',
  'Environment & Forest',
  'Labour / HR',
  'Electrical',
  'Mining',
];
const ROLE_LABEL = { admin: 'Administrator', supervisor: 'Team Lead', user: 'Officer' };

const blank = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  mine: '',
  dept: '',
  designation: '',
  reportsTo: '',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'new' | user
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    API.get('/users')
      .then((r) => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    API.get('/mines').then((r) => setMines(r.data)).catch(() => {});
  }, [load]);

  // possible supervisors for the reportsTo dropdown (same mine, role supervisor)
  const supervisors = users.filter((u) => u.role === 'supervisor');

  const openNew = () => {
    setForm(blank);
    setModal('new');
  };
  const openEdit = (u) => {
    setForm({
      ...blank,
      ...u,
      password: '',
      mine: u.mine?._id || u.mine || '',
      reportsTo: u.reportsTo?._id || u.reportsTo || '',
    });
    setModal(u);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.role === 'admin') {
        payload.mine = null;
        payload.reportsTo = null;
      }
      if (!payload.reportsTo) payload.reportsTo = null;

      if (modal === 'new') {
        await API.post('/auth/register', payload);
        toast.success('User created');
      } else {
        if (!payload.password) delete payload.password;
        await API.put(`/users/${modal._id}`, payload);
        toast.success('User updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (u) => {
    try {
      await API.patch(`/users/${u._id}/status`, { isActive: !u.isActive });
      load();
    } catch {
      toast.error('Could not change status');
    }
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}?`)) return;
    try {
      await API.delete(`/users/${u._id}`);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <PageHeader
        title="Users & Team"
        subtitle="Manage administrators, team leads and officers, and the reporting chain"
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add user
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Mine</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Reports to</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{ROLE_LABEL[u.role]}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {u.mine?.name || (u.role === 'admin' ? 'All' : '—')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.dept || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{u.reportsTo?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => toggle(u)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600"
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => remove(u)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'new' ? 'Add user' : 'Edit user'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={modal === 'new' ? 'Password' : 'New password (optional)'} required={modal === 'new'}>
              <input
                type="password"
                required={modal === 'new'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputCls}
                placeholder={modal === 'new' ? '' : 'Leave blank to keep current'}
              />
            </Field>
            <Field label="Role" required>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputCls}
              >
                <option value="user">Officer (User)</option>
                <option value="supervisor">Team Lead (Supervisor)</option>
                <option value="admin">Administrator</option>
              </select>
            </Field>
          </div>

          {form.role !== 'admin' && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Mine" required>
                  <select
                    required
                    value={form.mine}
                    onChange={(e) => setForm({ ...form, mine: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select mine</option>
                    {mines.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Department">
                  <select
                    value={form.dept}
                    onChange={(e) => setForm({ ...form, dept: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">—</option>
                    {DEPTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Designation">
                  <input
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Agent, Manager"
                  />
                </Field>
                {form.role === 'user' && (
                  <Field label="Reports to (Team Lead)">
                    <select
                      value={form.reportsTo}
                      onChange={(e) => setForm({ ...form, reportsTo: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">—</option>
                      {supervisors
                        .filter(
                          (s) =>
                            !form.mine ||
                            String(s.mine?._id || s.mine) === String(form.mine)
                        )
                        .map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </Field>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
