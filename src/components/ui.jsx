import { X } from 'lucide-react';

/* ---------- status + category colour maps ---------- */
export const STATUS_STYLES = {
  Pending: 'bg-slate-100 text-slate-700 ring-slate-200',
  Upcoming: 'bg-sky-50 text-sky-700 ring-sky-200',
  'Due This Month': 'bg-amber-50 text-amber-700 ring-amber-200',
  Overdue: 'bg-rose-50 text-rose-700 ring-rose-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {status}
    </span>
  );
}

/* ---------- stat tile ---------- */
export function StatCard({ label, value, accent = 'slate', icon: Icon, onClick }) {
  const accents = {
    slate: 'text-slate-900',
    sky: 'text-sky-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition
        ${onClick ? 'hover:border-slate-300 hover:shadow-sm cursor-pointer' : 'cursor-default'}`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`mt-1 text-3xl font-semibold tracking-tight ${accents[accent]}`}>
          {value}
        </p>
      </div>
      {Icon && (
        <div className={`rounded-lg bg-slate-50 p-2.5 ${accents[accent]}`}>
          <Icon size={22} />
        </div>
      )}
    </button>
  );
}

/* ---------- modal ---------- */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-16">
      <div className={`w-full ${maxWidth} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------- form field ---------- */
export function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 ' +
  'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';

/* ---------- misc ---------- */
export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
