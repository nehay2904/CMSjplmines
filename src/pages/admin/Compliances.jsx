import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, History } from 'lucide-react';
import API from '../../api/axios';
import ComplianceTable from '../../components/ComplianceTable';
import {
  Modal,
  Field,
  inputCls,
  Spinner,
  PageHeader,
  StatusBadge,
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

const BLANK_FORM = {
  complianceId: '',
  mines: [],
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

const fileUrl = (filePath) => {
  const base = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');
  return `${base}/${filePath}`.replace(/([^:]\/)\/+/g, '$1');
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

/* ---------------------------------------------------------------------- */
/* Small presentational pieces                                            */
/* ---------------------------------------------------------------------- */

function MineCheckboxes({ mines, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-slate-300 px-3 py-2">
      {mines.map((m) => (
        <label key={m._id} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(m._id)}
            onChange={(e) => {
              const updated = e.target.checked
                ? [...selected, m._id]
                : selected.filter((id) => id !== m._id);
              onChange(updated);
            }}
            className="rounded border-slate-300 text-indigo-600"
          />
          {m.name}
        </label>
      ))}
    </div>
  );
}

function RowActions({ compliance, onHistory, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => onHistory(compliance)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        title="History"
      >
        <History size={16} />
      </button>
      <button
        onClick={() => onEdit(compliance)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
        title="Edit"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => onDelete(compliance)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function HistoryEntry({ entry }) {
  const proofs = entry.proofs || [];
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-800">
          Cycle due {fmtDate(entry.cycleDueDate)}
        </span>
        <StatusBadge status="Completed" />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-600 sm:grid-cols-2">
        <p>Completed on: {fmtDate(entry.completedDate)}</p>
        <p>Completed by: {entry.completedBy?.name || '—'}</p>
      </div>

      {entry.driveLink && (
        <a
          href={entry.driveLink}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
        >
          View document link
        </a>
      )}

      {proofs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {proofs.map((p, i) => (
            <a
              key={p.filePath || i}
              href={fileUrl(p.filePath)}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            >
              {p.fileName}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** Builds the list of completion entries to show for a compliance, newest first. */
function getHistoryEntries(compliance) {
  const cycles = compliance.completionHistory || [];
  const isRecurring = !!compliance.recurrenceMonths;
  const hasOneTimeCompletion =
    !isRecurring && compliance.status === 'Completed' && !!compliance.completedDate;

  if (hasOneTimeCompletion) {
    return [
      {
        cycleDueDate: compliance.dueDate,
        completedDate: compliance.completedDate,
        completedBy: compliance.completedBy,
        proofs: compliance.proofs || [],
        driveLink: compliance.driveLink,
      },
    ];
  }
  return [...cycles].reverse();
}

function HistoryModal({ compliance, onClose }) {
  const entries = compliance ? getHistoryEntries(compliance) : [];

  return (
    <Modal
      open={!!compliance}
      onClose={onClose}
      title={compliance ? `History — ${compliance.title}` : 'History'}
      maxWidth="max-w-2xl"
    >
      {entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Not completed yet — no history to show.
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <HistoryEntry key={i} entry={entry} />
          ))}
        </div>
      )}
    </Modal>
  );
}

function ComplianceFormModal({ open, isNew, mines, form, setForm, saving, onSubmit, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'New compliance' : 'Edit compliance'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Compliance ID" required>
            <input
              required
              value={form.complianceId}
              onChange={(e) => setForm({ ...form, complianceId: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Applies to (mines)" required>
            <MineCheckboxes
              mines={mines}
              selected={form.mines}
              onChange={(updated) => setForm({ ...form, mines: updated })}
            />
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
            onClick={onClose}
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
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function Compliances() {
  const [rows, setRows] = useState([]);
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mine: '', category: '', status: '', search: '' });
  const [modal, setModal] = useState(null); // null | 'new' | compliance object being edited
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [historyItem, setHistoryItem] = useState(null); // compliance being viewed for history

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
    setForm({ ...BLANK_FORM });
    setModal('new');
  };

  const openEdit = (c) => {
    setForm({
      ...BLANK_FORM,
      ...c,
      mines: (c.mines || []).map((m) => m._id || m),
      dueDate: c.dueDate ? c.dueDate.slice(0, 10) : '',
      alertDate: c.alertDate ? c.alertDate.slice(0, 10) : '',
    });
    setModal(c);
  };

  const closeForm = () => setModal(null);

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
      closeForm();
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
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> New compliance
          </button>
        }
      />

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
            <RowActions
              compliance={c}
              onHistory={setHistoryItem}
              onEdit={openEdit}
              onDelete={remove}
            />
          )}
        />
      )}

      <ComplianceFormModal
        open={!!modal}
        isNew={modal === 'new'}
        mines={mines}
        form={form}
        setForm={setForm}
        saving={saving}
        onSubmit={save}
        onClose={closeForm}
      />

      <HistoryModal compliance={historyItem} onClose={() => setHistoryItem(null)} />
    </>
  );
}