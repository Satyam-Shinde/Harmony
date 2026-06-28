import { useState, useEffect } from 'react';
import { BookOpen, Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { API, getToken, levelLabel } from '../lib/utils';

interface Subject { _id?: string; name: string; marks: number; commandLevel: number; }

const levelColor: Record<number, string> = { 1:'#9CA3AF', 2:'#6B7280', 3:'#F59E0B', 4:'#4F46E5', 5:'#10B981' };
const levelBg:    Record<number, string> = { 1:'#F9FAFB', 2:'#F3F4F6', 3:'#FFFBEB', 4:'#EEF2FF', 5:'#ECFDF5' };

export default function Subjects() {
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState<Subject>({ name: '', marks: 0, commandLevel: 3 });
  const [showForm, setShowForm]   = useState(false);
  const token = getToken();

  useEffect(() => { load(); }, []);
  const load = async () => {
    const res = await fetch(`${API}/user/subjects`, { headers: { Authorization: `Bearer ${token}` } });
    const d   = await res.json(); setSubjects(d.subjects || []);
  };

  const save = async () => {
    if (!form.name.trim()) return; setLoading(true);
    try {
      const url    = editingId ? `${API}/user/subjects/${editingId}` : `${API}/user/subjects`;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.message);
      editingId ? setSubjects(p => p.map(s => s._id === editingId ? data.subject : s)) : setSubjects(p => [...p, data.subject]);
      cancel();
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    await fetch(`${API}/user/subjects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setSubjects(p => p.filter(s => s._id !== id));
  };

  const edit = (s: Subject) => { setEditingId(s._id || null); setForm({ name: s.name, marks: s.marks, commandLevel: s.commandLevel }); setShowForm(true); };
  const cancel = () => { setEditingId(null); setForm({ name: '', marks: 0, commandLevel: 3 }); setShowForm(false); };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-sub">Manage your academic subjects and command levels</p>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)} icon={<Plus className="w-4 h-4" />}>Add Subject</Button>}
      </div>

      {showForm && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{editingId ? 'Edit Subject' : 'New Subject'}</span>
            <button onClick={cancel} style={{ color: 'var(--muted)' }}><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input label="Subject Name" placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input type="number" label="Marks (weightage)" placeholder="0" value={form.marks} onChange={e => setForm({ ...form, marks: Number(e.target.value) })} />
            <div>
              <label className="label">Command Level</label>
              <select className="select" value={form.commandLevel} onChange={e => setForm({ ...form, commandLevel: Number(e.target.value) })}>
                {[1,2,3,4,5].map(l => <option key={l} value={l}>{l} — {levelLabel[l]}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={cancel}>Cancel</Button>
            <Button onClick={save} loading={loading} icon={<Check className="w-3.5 h-3.5" />}>{editingId ? 'Update' : 'Add Subject'}</Button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: '1fr 5.5rem 11rem 5.5rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--surface-2)' }}>
          <span>Subject</span><span>Marks</span><span>Command Level</span><span className="text-right">Actions</span>
        </div>
        {!subjects.length ? (
          <div className="empty-state">
            <BookOpen className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>No subjects yet</p>
            <button onClick={() => setShowForm(true)} className="text-sm link">Add your first subject →</button>
          </div>
        ) : subjects.map((s, i) => (
          <div key={s._id || i} className="grid px-5 py-4 items-center row-hover" style={{ gridTemplateColumns: '1fr 5.5rem 11rem 5.5rem', borderBottom: i < subjects.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{s.name}</span>
            <span className="text-sm" style={{ color: 'var(--text-2)' }}>{s.marks}</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(l => <div key={l} className="w-1.5 h-4 rounded-sm" style={{ background: l <= s.commandLevel ? levelColor[s.commandLevel] : 'var(--border)', opacity: l <= s.commandLevel ? 1 : 0.3 }} />)}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: levelBg[s.commandLevel], color: levelColor[s.commandLevel] }}>{levelLabel[s.commandLevel]}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => edit(s)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--primary-light)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.background = ''; }}><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => s._id && del(s._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--error)'; (e.currentTarget as HTMLElement).style.background = 'var(--error-light)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.background = ''; }}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
