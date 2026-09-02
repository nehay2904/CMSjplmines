import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import API from '../../api/axios';
import ComplianceTable from '../../components/ComplianceTable';
import {
  Modal,
  Field,
  inputCls,
  Spinner,
  PageHeader,
} from '../../components/ui';

const CATEGORIES = [
  'DGMS',
  'PESO',
  'Central Electricity Authority',
  'Environment',
  'Labour',
  'HR & Establishment',
  'CCO / Ministry of Coal',
  'Ministry of Coal',
  'MoEF&CC / Environment',
  'CGPCB',
  'CGWA',
  'Forest Department',
  'District Administration / Gram Sabha',
  'State Mining Department',
];
const SUBTYPES = ['Notice', 'Return', 'Record'];
const STATUSES = ['Pending', 'Upcoming', 'Due This Month', 'Overdue', 'Completed'];

const blank = {
  complianceId: '',
  mine: '',
  category: 'DGMS',
  subCategory: '',
  title: '',
  detail: '',
  act: '',
  regulationRef: '',
  formNo: '',
  frequency: '',
  monitoringAuthority: '',
  signerRole: '',
  dueDate: '',
  alertDate: '',
  status: 'Pending',
  driveLink: '',
};

export default function Compliances() {
  const [rows, setRows] = useState([]);
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mine: '', category: '', status: '', search: '' });
  const [modal, setModal] = useState(null); // null | 'new' | compliance object
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/mines').then((r) => setMines(r.data)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    API.get('/compliances', { params })
      .then((r) => setRows(r.data))
      .catch(() => toast.error('Failed to load compliances'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openNew = () => {
    setForm({ ...blank, mine: mines[0]?._id || '' });
    setModal('new');
  };

  const openEdit = (c) => {
    setForm({
      ...blank,
      ...c,
      mine: c.mine?._id || c.mine || '',
      dueDate: c.dueDate ? c.dueDate.slice(0, 10) : '',
      alertDate: c.alertDate ? c.alertDate.slice(0, 10) : '',
    });
    setModal(c);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.alertDate) delete payload.alertDate;

      if (modal === 'new') {
        await API.post('/compliances', payload);
        toast.success('Compliance created');
      } else {
        await API.put(`/compliances/${modal._id}`, payload);
        toast.success('Compliance updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/compliances/${c._id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <PageHeader
        title="Compliances"
        subtitle="Master register — create, edit and organise items per mine"
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> New compliance
          </button>
        }
      />

      {/* filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search title, ID, act…"
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
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className={inputCls}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={inputCls}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
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
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => openEdit(c)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => remove(c)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'new' ? 'New compliance' : 'Edit compliance'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Compliance ID" required>
              <input
                required
                value={form.complianceId}
                onChange={(e) => setForm({ ...form, complianceId: e.target.value })}
                className={inputCls}
              />
            </Field>
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
          </div>

          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className={inputCls}
              >
                <option value="">—</option>
                {SUBTYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Act">
              <input
                value={form.act}
                onChange={(e) => setForm({ ...form, act: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Regulation ref.">
              <input
                value={form.regulationRef}
                onChange={(e) => setForm({ ...form, regulationRef: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Form no.">
              <input
                value={form.formNo}
                onChange={(e) => setForm({ ...form, formNo: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Frequency">
              <input
                placeholder="Annual, Monthly…"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Monitoring authority">
              <input
                value={form.monitoringAuthority}
                onChange={(e) => setForm({ ...form, monitoringAuthority: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Signer role">
              <input
                value={form.signerRole}
                onChange={(e) => setForm({ ...form, signerRole: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Due date">
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Alert date">
              <input
                type="date"
                value={form.alertDate}
                onChange={(e) => setForm({ ...form, alertDate: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Detail / conditions">
            <textarea
              rows={3}
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Document link (Drive)">
            <input
              value={form.driveLink || ''}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              className={inputCls}
            />
          </Field>

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
