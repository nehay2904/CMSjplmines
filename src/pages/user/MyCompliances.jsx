import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Upload, Repeat, X, FileText } from 'lucide-react';
import API from '../../api/axios';
import { Modal, Field, inputCls, Spinner, PageHeader, StatusBadge } from '../../components/ui';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const recurrenceLabel = { 1: 'Monthly', 3: 'Quarterly', 6: 'Half-yearly', 12: 'Annual' };

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';

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

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file

    const tooBig = picked.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig.length) toast.error(`${tooBig.map((f) => f.name).join(', ')} exceeds ${MAX_SIZE_MB} MB`);

    const ok = picked.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    setFiles((prev) => {
      const merged = [...prev, ...ok].slice(0, MAX_FILES);
      if (prev.length + ok.length > MAX_FILES) toast.error(`Max ${MAX_FILES} files`);
      return merged;
    });
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const submitDone = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Upload at least one proof document');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('proofs', f));
      if (driveLink.trim()) fd.append('driveLink', driveLink.trim());
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
      <PageHeader title="My Compliances" />

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

            <Field label={<>Upload proof <span className="text-red-500">*</span> <span className="font-normal text-slate-400">(required, up to {MAX_FILES} files, {MAX_SIZE_MB} MB each)</span></>}>
              <label
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-sm hover:border-indigo-400 hover:text-indigo-600 ${
                  files.length ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-slate-500'
                }`}
              >
                <Upload size={18} />
                {files.length ? `${files.length} file(s) selected — add more` : 'Choose files'}
                <input
                  type="file"
                  multiple
                  accept={ACCEPT}
                  className="hidden"
                  onChange={addFiles}
                  disabled={files.length >= MAX_FILES}
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <FileText size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate">{f.name}</span>
                        <span className="shrink-0 text-slate-400">
                          ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="ml-2 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                      >
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <Field label="Document link (optional)">
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
                disabled={saving || files.length === 0}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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