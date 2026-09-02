import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import API from '../api/axios';
import ComplianceTable from './ComplianceTable';
import { Spinner, PageHeader, inputCls, Modal, StatusBadge } from './ui';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/**
 * subCategory: 'Notice' | 'Return' | 'Record' | undefined (all)
 * title, subtitle: page copy
 * columns: passed through to ComplianceTable
 */
export default function ComplianceSection({ subCategory, title, subtitle, columns }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState(null); // compliance shown in read-only modal

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

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

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
          columns={columns || ['id', 'title', 'category', 'due', 'status', 'proof']}
          onRowClick={setDetail}
        />
      )}

      {/* read-only detail with the "conditions written in it" */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title || ''}
        maxWidth="max-w-xl"
      >
        {detail && (
          <div className="space-y-4 text-sm">
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

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Detail label="Compliance ID" value={detail.complianceId} />
              <Detail label="Mine" value={detail.mine?.name} />
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
          </div>
        )}
      </Modal>
    </>
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
