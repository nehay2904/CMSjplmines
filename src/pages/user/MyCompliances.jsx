import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Upload, Repeat } from 'lucide-react';
import API from '../../api/axios';
import { Modal, Field, inputCls, Spinner, PageHeader, StatusBadge } from '../../components/ui';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const recurrenceLabel = { 1: 'Monthly', 3: 'Quarterly', 6: 'Half-yearly', 12: 'Annual' };

export default function MyReturns() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(null);
  const [files, setFiles] = useState([]);
  const [driveLink, setDriveLink] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    API.get('/compliances', { params: { subCategory: 'Return' } })
      .then((r) => setRows(r.data))
      .catch(() => toast.error('Failed to load returns'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

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
      const { data } = await API.patch(`/compliances/${done._id}/complete`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.recurrenceMonths) {
        toast.success(`Done — next due date: ${fmt(data.dueDate)}`);
      } else {
        toast.success('Marked complete');
      }
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
      <PageHeader title="My Compliances" subtitle="Returns assigned to you" />

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1fr_2.2fr_1fr_1fr_1fr_auto] gap-x-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>ID</span>
            <span>Title</span>
            <span>Due</span>
            <span>Status</span>
            <span>Recurrence</span>
            <span />
          </div>

          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">
              No returns assigned to you.
            </p>
          ) : (
            rows.map((c) => (
              <div
                key={c._id}
                className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 last:border-0 sm:grid-cols-[1fr_2.2fr_1fr_1fr_1fr_auto] sm:items-center"
              >
                <div className="text-xs text-slate-400">{c.complianceId}</div>
                <div className="text-sm font-medium text-slate-800">{c.title}</div>
                <div className="text-sm text-slate-600">{fmt(c.dueDate)}</div>
                <div><StatusBadge status={c.status} /></div>
                <div className="text-xs text-slate-500">
                  {c.recurrenceMonths ? (
                    <span className="inline-flex items-center gap-1">
                      <Repeat size={12} /> {recurrenceLabel[c.recurrenceMonths] || 'Recurring'}
                    </span>
                  ) : (
                    'One-time'
                  )}
                </div>
                <div>
                  {c.status === 'Completed' ? (
                    <span className="text-xs text-emerald-600">Done</span>
                  ) : (
                    <button
                      onClick={() => openDone(c)}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <CheckCircle2 size={14} /> Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal open={!!done} onClose={() => setDone(null)} title="Complete return">
        {done && (
          <form onSubmit={submitDone} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{done.title}</p>
              <p className="text-slate-500">Due {fmt(done.dueDate)}</p>
              {done.recurrenceMonths && (
                <p className="mt-2 text-xs text-indigo-600">
                  Recurring — completing this will roll the due date forward automatically.
                </p>
              )}
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