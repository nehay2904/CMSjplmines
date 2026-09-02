import { useEffect, useState } from 'react';
import { User, ArrowUp, Users as UsersIcon } from 'lucide-react';
import API from '../../api/axios';
import { Spinner, PageHeader, EmptyState } from '../../components/ui';

function PersonCard({ p, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-200',
    indigo: 'border-indigo-200 bg-indigo-50/40',
  };
  return (
    <div className={`rounded-xl border bg-white p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          {p.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-400">{p.email}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {p.designation && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {p.designation}
          </span>
        )}
        {p.dept && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{p.dept}</span>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/hierarchy')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="My Team" subtitle="Your reporting line and the officers under you" />

      {data?.above && (
        <div className="mb-8">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <ArrowUp size={14} /> Reports to
          </p>
          <div className="max-w-sm">
            <PersonCard p={data.above} tone="indigo" />
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <UsersIcon size={14} /> Your officers ({data?.below?.length || 0})
        </p>
        {data?.below?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.below.map((p) => (
              <PersonCard key={p._id} p={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No officers assigned yet"
            hint="An administrator can set officers to report to you."
          />
        )}
      </div>
    </>
  );
}
