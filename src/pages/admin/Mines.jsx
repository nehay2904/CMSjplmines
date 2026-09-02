import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import API from '../../api/axios';
import { Modal, Field, inputCls, Spinner, PageHeader } from '../../components/ui';

const blank = { name: '', code: '', type: 'working', location: '', isActive: true };

export default function Mines() {
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    API.get('/mines')
      .then((r) => setMines(r.data))
      .catch(() => toast.error('Failed to load mines'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const openNew = () => {
    setForm(blank);
    setModal('new');
  };
  const openEdit = (m) => {
    setForm({ ...blank, ...m });
    setModal(m);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'new') {
        await API.post('/mines', form);
        toast.success('Mine created');
      } else {
        await API.put(`/mines/${modal._id}`, form);
        toast.success('Mine updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m) => {
    if (!confirm(`Delete ${m.name}?`)) return;
    try {
      await API.delete(`/mines/${m._id}`);
      toast.success('Mine deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <PageHeader
        title="Mines"
        subtitle="The sites tracked in CompliTrack"
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add mine
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mines.map((m) => (
            <div
              key={m._id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.code}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(m)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(m)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.type === 'working'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {m.type === 'working' ? 'Working' : 'Greenfield'}
                </span>
                {m.location && <span className="text-xs text-slate-400">{m.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'new' ? 'Add mine' : 'Edit mine'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name" required>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Code" required>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={inputCls}
                placeholder="GP4-1"
              />
            </Field>
            <Field label="Type" required>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
              >
                <option value="working">Working</option>
                <option value="greenfield">Greenfield</option>
              </select>
            </Field>
          </div>
          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal(null)}
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
    </>
  );
}
