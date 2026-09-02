import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, CheckCircle2, Upload } from 'lucide-react';
import API from '../../api/axios';
import ComplianceTable from '../../components/ComplianceTable';
import { Modal, Field, inputCls, Spinner, PageHeader, StatusBadge } from '../../components/ui';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function MyCompliances() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [done, setDone] = useState(null); // compliance being completed
  const [files, setFiles] = useState([]);
  const [driveLink, setDriveLink] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    API.get('/compliances', { params })
      .then((r) => setRows(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openDone = (c) => {
    setDone(c);
    setFiles([]);
    setDriveLink(c.driveLink || '');
  };

  const submitDone = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('proofs', f));
      if (driveLink) fd.append('driveLink', driveLink);
      await API.patch(`/compliances/${done._id}/complete`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Marked complete');
      setDone(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not complete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="My Compliances"
        subtitle="Everything assigned to you — upload proof to mark an item complete"
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputCls} w-auto`}
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
          columns={['id', 'title', 'category', 'due', 'status', 'proof']}
          rowAction={(c) =>
            c.status === 'Completed' ? (
              <span className="text-xs text-emerald-600">Done</span>
            ) : (
              <button
                onClick={() => openDone(c)}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                <CheckCircle2 size={14} /> Complete
              </button>
            )
          }
        />
      )}

      <Modal open={!!done} onClose={() => setDone(null)} title="Mark as complete">
        {done && (
          <form onSubmit={submitDone} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{done.title}</p>
              <p className="text-slate-500">
                {done.category} · due {fmt(done.dueDate)}
              </p>
              <div className="mt-2">
                <StatusBadge status={done.status} />
              </div>
            </div>

            <Field label="Upload proof (optional, up to 5 files)">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-6 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
                <Upload size={18} />
                {files.length ? `${files.length} file(s) selected` : 'Choose files'}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
                />
              </label>
            </Field>

            <Field label="Or paste a document link">
              <input
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className={inputCls}
                placeholder="https://drive.google.com/…"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDone(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? 'Submitting…' : 'Confirm complete'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
