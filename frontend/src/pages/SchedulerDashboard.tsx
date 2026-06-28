import { useState, useEffect } from 'react';
import { Plus, X, Wand2, Calendar, BookOpen, Check } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { API, getToken, levelLabel } from '../lib/utils';

interface Subject { _id?: string; name: string; marks: number; commandLevel: number; }
type Status = 'pending' | 'completed';
interface Task { _id: string; subject: string; topic: string; duration_minutes: number; status: Status; }
interface Schedule { _id: string; date: string; tasks: Task[]; }

export default function SchedulerDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSub, setNewSub]     = useState<Subject>({ name: '', marks: 0, commandLevel: 3 });
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading]   = useState(false);
  const token = getToken();
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => { fetchSubjects(); fetchSchedule(); }, []);

  const fetchSubjects = async () => {
    const res = await fetch(`${API}/user/subjects`, { headers: { Authorization: `Bearer ${token}` } });
    const d   = await res.json(); setSubjects(d.subjects || []);
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`${API}/scheduler/${today}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const d = await res.json(); if (d) setSchedule(d);
    } catch {}
  };

  const addSubject = async () => {
    if (!newSub.name.trim()) return;
    const res  = await fetch(`${API}/user/subjects`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newSub) });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }
    setSubjects(p => [...p, data.subject]); setNewSub({ name: '', marks: 0, commandLevel: 3 }); setShowForm(false);
  };

  const generate = async () => {
    if (!subjects.length) { alert('Add at least one subject first.'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/scheduler/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSchedule(data);
    } catch (e: any) { alert(e.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const toggleTask = async (taskId: string, current: Status) => {
    const status = current === 'completed' ? 'pending' : 'completed';
    const res = await fetch(`${API}/scheduler/task/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    if (!res.ok) return;
    setSchedule(p => p ? { ...p, tasks: p.tasks.map(t => t._id === taskId ? { ...t, status } : t) } : p);
  };

  const done  = schedule?.tasks.filter(t => t.status === 'completed').length ?? 0;
  const total = schedule?.tasks.length ?? 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Scheduler</h1>
          <p className="page-sub">AI plans your day — weighted by quiz scores & command level</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowForm(v => !v)}>
            {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Add Subject</>}
          </Button>
          <Button onClick={generate} loading={loading}>
            <Wand2 className="w-3.5 h-3.5" /> Generate Schedule
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="card p-5 mb-5">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Add Subject</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input label="Name" placeholder="e.g. Mathematics" value={newSub.name} onChange={e => setNewSub({ ...newSub, name: e.target.value })} />
            <Input type="number" label="Marks" value={newSub.marks} onChange={e => setNewSub({ ...newSub, marks: Number(e.target.value) })} />
            <div>
              <label className="label">Command Level</label>
              <select className="select" value={newSub.commandLevel} onChange={e => setNewSub({ ...newSub, commandLevel: Number(e.target.value) })}>
                {[1,2,3,4,5].map(l => <option key={l} value={l}>{l} — {levelLabel[l]}</option>)}
              </select>
            </div>
            <Button onClick={addSubject}>Add</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Subjects */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>My Subjects</span>
          </div>
          <div className="divider mb-4" />
          {!subjects.length ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--muted)' }}>No subjects yet</p>
          ) : (
            <div className="space-y-2">
              {subjects.map(s => (
                <div key={s._id || s.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{s.marks} marks · {levelLabel[s.commandLevel]}</p>
                  </div>
                  <span className="badge badge-blue">Lv {s.commandLevel}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Today's Schedule</span>
              {schedule && <span className="text-xs" style={{ color: 'var(--muted)' }}>{schedule.date}</span>}
            </div>
            {total > 0 && <span className="text-xs font-medium" style={{ color: done === total ? 'var(--success)' : 'var(--muted)' }}>{done}/{total} completed</span>}
          </div>
          {total > 0 && <div className="progress-track mb-4"><div className={`progress-fill ${done === total ? 'progress-green' : ''}`} style={{ width: `${(done/total)*100}%` }} /></div>}
          <div className="divider mb-4" />
          {!schedule ? (
            <div className="empty-state">
              <Wand2 className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
              <p className="font-medium text-sm" style={{ color: 'var(--text-2)' }}>No schedule yet</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Click "Generate Schedule" — it uses your quiz history for smarter planning</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.tasks.map((task, i) => (
                <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: task.status === 'completed' ? 'var(--success-light)' : 'var(--surface-2)', border: `1px solid ${task.status === 'completed' ? 'var(--success-border)' : 'var(--border)'}` }}>
                  <button onClick={() => toggleTask(task._id, task.status)} className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all" style={{ background: task.status === 'completed' ? 'var(--success)' : 'white', border: `2px solid ${task.status === 'completed' ? 'var(--success)' : 'var(--border-2)'}` }}>
                    {task.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-xs font-mono w-5 flex-shrink-0" style={{ color: 'var(--subtle)' }}>{String(i+1).padStart(2,'0')}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium" style={{ color: task.status === 'completed' ? 'var(--success)' : 'var(--text)', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.subject}</span>
                    <span className="text-sm" style={{ color: 'var(--muted)' }}> — {task.topic}</span>
                  </div>
                  <span className="badge badge-gray flex-shrink-0">{task.duration_minutes}m</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
