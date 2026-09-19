import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Search, Upload, FileText, ExternalLink, X } from 'lucide-react';
import API from '../api/axios';
import ComplianceTable from './ComplianceTable';
import { Spinner, PageHeader, inputCls, Modal, StatusBadge } from './ui';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const fileUrl = (filePath) => {
  const base = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');
  return `${base}/${filePath}`.replace(/([^:]\/)\/+/g, '$1');
};

const MAX_SIZE_MB = 10;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';

export default function ComplianceSection({ subCategory, title, columns, fullWidth }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (subCategory) params.subCategory = subCategory;
    if (search) params.search = search;
    if (status) params.status = status;
    API.get('/compliances', { params })
      .then((r) => setRows(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [subCategory, search, status]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  // when a record is updated (new proofs), sync into detail state too
  const handleRecordUpdate = (updated) => {
    setDetail(updated);
    setRows((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  };

  const breakout = fullWidth
    ? 'relative left-1/2 right-1/2 -mx-[50vw] w-screen px-4 sm:px-6 lg:px-8'
    : '';

  return (
    <>
      <PageHeader title={title} />

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
          {['Pending', 'Upcoming', 'Overdue', 'Completed'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className={breakout}>
          <ComplianceTable
            rows={rows}
            columns={columns || ['id', 'title', 'category', 'due', 'status', 'proof']}
            onRowClick={setDetail}
          />
        </div>
      )}

      <DetailModal
        detail={detail}
        onClose={() => setDetail(null)}
        onRecordUpdate={handleRecordUpdate}
      />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Detail modal — shared for all subCategories; upload panel only for Record */
/* ---------------------------------------------------------------------- */

function DetailModal({ detail, onClose, onRecordUpdate }) {
  const isRecord = detail?.subCategory === 'Record';
  const isNotice = detail?.subCategory === 'Notice';

  return (
    <Modal
      open={!!detail}
      onClose={onClose}
      title={detail?.title || ''}
      maxWidth="max-w-2xl"
    >
      {detail && (
        <div className="space-y-5 text-sm">
          {/* badges */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={detail.status} />
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {detail.category}
            </span>
            {detail.subCategory && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {detail.subCategory}
              </span>
            )}
          </div>

          {/* metadata grid */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Detail label="Compliance ID" value={detail.complianceId} />
            <Detail label="Mines" value={(detail.mines || []).map((m) => m.name || m).join(', ')} />
            <Detail label="Act" value={detail.act} />
            <Detail label="Regulation ref." value={detail.regulationRef} />
            <Detail label="Form no." value={detail.formNo} />
            <Detail label="Frequency" value={detail.frequency} />
            <Detail label="Monitoring authority" value={detail.monitoringAuthority} />
            <Detail label="Signer role" value={detail.signerRole} />
            <Detail label="Due date" value={fmt(detail.dueDate)} />
            <Detail label="Assigned to" value={detail.assignedTo?.name} />
          </dl>

          {detail.detail && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Conditions / detail
              </p>
              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">
                {detail.detail}
              </p>
            </div>
          )}

          {detail.driveLink && (
            <a
              href={detail.driveLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Open document →
            </a>
          )}

          {/* Record / Notice: upload + proof history */}
          {(isRecord || isNotice) && (
            <RecordUploadPanel
              detail={detail}
              onUpdate={onRecordUpdate}
              route={isRecord ? 'upload-record' : 'upload-notice'}
            />
          )}
        </div>
      )}
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Upload panel + proof history for Records                                */
/* ---------------------------------------------------------------------- */

function RecordUploadPanel({ detail, onUpdate, route }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    const tooBig = picked.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig.length) toast.error(`${tooBig.map((f) => f.name).join(', ')} exceeds ${MAX_SIZE_MB} MB`);
    const ok = picked.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    setFiles((prev) => [...prev, ...ok]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('proofs', f));
      const { data } = await API.patch(
        `/compliances/${detail._id}/${route}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success(`${files.length} file(s) uploaded`);
      setFiles([]);
      onUpdate(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const proofs = detail.proofs || [];

  return (
    <div className="space-y-4 border-t border-slate-100 pt-4">
      {/* upload area */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Upload proof / document
        </p>
        <label
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-5 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          <Upload size={16} />
          Choose files (PDF, image, Word, Excel — up to {MAX_SIZE_MB} MB each)
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={addFiles}
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
                  <FileText size={12} className="shrink-0 text-slate-400" />
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0 text-slate-400">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-2 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {files.length > 0 && (
          <button
            onClick={submit}
            disabled={uploading}
            className="mt-2 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Upload size={13} />
            {uploading ? 'Uploading…' : `Upload ${files.length} file(s)`}
          </button>
        )}
      </div>

      {/* proof history */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Uploaded documents ({proofs.length})
        </p>
        {proofs.length === 0 ? (
          <p className="text-xs italic text-slate-400">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {[...proofs].reverse().map((p, i) => (
              <li key={i} className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText size={14} className="shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    {p.filePath ? (
                      <a
                        href={fileUrl(p.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 truncate text-xs font-medium text-indigo-700 hover:text-indigo-900"
                      >
                        <span className="truncate">{p.fileName || 'File'}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    ) : (
                      <span className="truncate text-xs text-slate-700">{p.fileName || 'File'}</span>
                    )}
                    <p className="text-xs text-slate-400">
                      {p.uploadedBy?.name && `${p.uploadedBy.name} · `}{fmtTime(p.uploadedAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value || '—'}</dd>
    </div>
  );
}