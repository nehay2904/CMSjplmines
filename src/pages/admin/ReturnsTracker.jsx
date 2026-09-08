import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Repeat, Upload } from 'lucide-react';
import API from '../../api/axios';
import { Modal, Field, inputCls, Spinner, PageHeader } from '../../components/ui';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const recurrenceLabel = { 1: 'Monthly', 3: 'Quarterly', 6: 'Half-yearly', 12: 'Annual' };

export default function ReturnsTracker() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
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

  const openComplete = (c) => {
    setCompleting(c);
    setFiles([]);
    setDriveLink('');
  };

  const submitComplete = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('proofs', f));
      if (driveLink) fd.append('driveLink', driveLink);

      const { data } = await API.patch(`/compliances/${completing._id}/complete`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.recurrenceMonths) {
        toast.success(`Done — rolled forward to next cycle: ${fmtDate(data.dueDate)}`);
      } else {
        toast.success('Marked completed');
      }
      setCompleting(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Returns"  />

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[2.2fr_1fr_1fr_1fr_auto] gap-x-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Title</span>
            <span>Due date</span>
            <span>Status</span>
            <span>Recurrence</span>
            <span />
          </div>

          {rows.map((c) => (
            <div
              key={c._id}
              className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 last:border-0 sm:grid-cols-[2.2fr_1fr_1fr_1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-400">{c.complianceId}</p>
              </div>
              <div className="text-sm text-slate-600">{fmtDate(c.dueDate)}</div>
              <div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {c.status || '—'}
                </span>
              </div>
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
                {c.status !== 'Completed' && (
                  <button
                    onClick={() => openComplete(c)}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircle size={14} /> Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!completing} onClose={() => setCompleting(null)} title="Complete return" maxWidth="max-w-md">
        {completing && (
          <form onSubmit={submitComplete} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{completing.title}</p>
              <p className="text-slate-500">Due {fmtDate(completing.dueDate)}</p>
              {completing.recurrenceMonths && (
                <p className="mt-1 text-xs text-indigo-600">
                  This is recurring — completing it will roll the due date forward automatically.
                </p>
              )}
            </div>

            <Field label="Upload proof (optional)">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className={inputCls}
              />
            </Field>

            <Field label="Drive link (optional)">
              <input
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className={inputCls}
                placeholder="https://drive.google.com/..."
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompleting(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <Upload size={14} /> {saving ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}