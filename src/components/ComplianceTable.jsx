import { StatusBadge } from './ui';
import { FileCheck2, Paperclip, ExternalLink } from 'lucide-react';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/**
 * columns: any subset of
 *   ['id','title','category','sub','mine','assignee','freq','due','status','proof']
 * rowAction: (compliance) => ReactNode  (rendered in a trailing column)
 */
export default function ComplianceTable({
  rows,
  columns = ['id', 'title', 'category', 'assignee', 'due', 'status'],
  rowAction,
  onRowClick,
}) {
  const has = (c) => columns.includes(c);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {has('id') && <th className="px-4 py-3">ID</th>}
              {has('title') && <th className="px-4 py-3">Title</th>}
              {has('category') && <th className="px-4 py-3">Category</th>}
              {has('sub') && <th className="px-4 py-3">Type</th>}
              {has('mine') && <th className="px-4 py-3">Mine</th>}
              {has('assignee') && <th className="px-4 py-3">Assigned to</th>}
              {has('freq') && <th className="px-4 py-3">Frequency</th>}
              {has('due') && <th className="px-4 py-3">Due</th>}
              {has('status') && <th className="px-4 py-3">Status</th>}
              {has('proof') && <th className="px-4 py-3">Proof</th>}
              {rowAction && <th className="px-4 py-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((c) => (
              <tr
                key={c._id}
                onClick={onRowClick ? () => onRowClick(c) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
              >
                {has('id') && (
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                    {c.complianceId}
                  </td>
                )}
                {has('title') && (
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{c.title}</p>
                    {c.act && <p className="text-xs text-slate-400">{c.act}</p>}
                  </td>
                )}
                {has('category') && (
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{c.category}</td>
                )}
                {has('sub') && (
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {c.subCategory || '—'}
                  </td>
                )}
                {has('mine') && (
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {c.mine?.name || '—'}
                  </td>
                )}
                {has('assignee') && (
                  <td className="whitespace-nowrap px-4 py-3">
                    {c.assignedTo ? (
                      <span className="text-slate-700">{c.assignedTo.name}</span>
                    ) : (
                      <span className="text-slate-300">Unassigned</span>
                    )}
                  </td>
                )}
                {has('freq') && (
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {c.frequency || '—'}
                  </td>
                )}
                {has('due') && (
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{fmt(c.dueDate)}</td>
                )}
                {has('status') && (
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                )}
                {has('proof') && (
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      {c.proofs?.length > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600" title="Proof uploaded">
                          <Paperclip size={14} />
                          {c.proofs.length}
                        </span>
                      )}
                      {c.driveLink && (
                        <a
                          href={c.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-500 hover:text-indigo-700"
                          title="Open document"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {!c.proofs?.length && !c.driveLink && <span>—</span>}
                    </div>
                  </td>
                )}
                {rowAction && (
                  <td className="whitespace-nowrap px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {rowAction(c)}
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  <FileCheck2 size={22} className="mx-auto mb-2 text-slate-300" />
                  No compliance items match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
