import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, FileText, ChevronRight, Copy, Check, History, HelpCircle } from 'lucide-react';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import { API, getToken } from '../lib/utils';

interface Subject { _id?: string; name: string; }

export default function Summarizer() {
  const [text, setText]        = useState('');
  const [summary, setSummary]  = useState('');
  const [loading, setLoading]  = useState(false);
  const [subjects, setSubjects]= useState<Subject[]>([]);
  const [subject, setSubject]  = useState('');
  const [copied, setCopied]    = useState(false);
  const fileRef  = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const token    = getToken();

  useEffect(() => {
    fetch(`${API}/user/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : d.subjects || [])).catch(() => {});
  }, []);

  const handleSummarize = async () => {
    if (!subject) { alert('Select a subject first'); return; }
    if (!text.trim()) return;
    setLoading(true); setSummary('');
    try {
      const res  = await fetch(`${API}/summarizer/summarize`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text, subject }) });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Failed'); setLoading(false); return; }
      setSummary(data.summaryText || data.summary);
    } catch { alert('Backend error — make sure all servers are running.'); }
    finally { setLoading(false); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!subject) { alert('Select a subject first'); return; }
    if (!file) return;
    setLoading(true); setSummary('');
    const fd = new FormData(); fd.append('file', file); fd.append('subject', subject);
    try {
      const res  = await fetch(`${API}/summarizer/file`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'File upload failed'); return; }
      setSummary(data.summaryText || data.summary);
    } catch { alert('File upload failed'); }
    finally { setLoading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const copy = () => { navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Summarizer</h1>
          <p className="page-sub">Paste text or upload a file — AI generates a concise summary</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/summarizer/history')}>
          <History className="w-3.5 h-3.5" /> History <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="card p-4 mb-5 flex items-center gap-4 flex-wrap">
        <label className="label mb-0 text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-2)' }}>Subject</label>
        <select className="select max-w-xs" value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="">— Select a subject —</option>
          {subjects.map((s, i) => <option key={s._id || i} value={s.name}>{s.name}</option>)}
        </select>
        {!subjects.length && (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            No subjects yet. <button onClick={() => navigate('/subjects')} className="link text-sm">Add one →</button>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card flex flex-col p-5" style={{ minHeight: 500 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: 'var(--muted)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Source Text</span>
            </div>
            <label className="cursor-pointer">
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFile} className="hidden" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='var(--primary)'; el.style.color='var(--primary)'; el.style.background='var(--primary-light)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='var(--border)'; el.style.color='var(--muted)'; el.style.background=''; }}>
                <Upload className="w-3.5 h-3.5" /> Upload File
              </div>
            </label>
          </div>
          <div className="divider mb-4" />
          <TextArea placeholder="Paste your study material here…" value={text} onChange={e => setText(e.target.value)} className="flex-1" style={{ minHeight: 340 }} />
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--subtle)' }}>{text.length.toLocaleString()} characters</span>
            <Button onClick={handleSummarize} loading={loading} disabled={!text.trim() || !subject}>
              <Sparkles className="w-3.5 h-3.5" /> Summarize
            </Button>
          </div>
        </div>

        <div className="card flex flex-col p-5" style={{ minHeight: 500 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Summary</span>
            </div>
            {summary && (
              <button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ color: copied ? 'var(--success)' : 'var(--muted)', background: copied ? 'var(--success-light)' : 'var(--surface-2)' }}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="divider mb-4" />
          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Generating summary…</p>
              </div>
            ) : summary ? (
              <div className="p-4 rounded-xl text-[0.9375rem] leading-relaxed overflow-auto h-full" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)', minHeight: 340 }}>
                {summary}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl" style={{ border: '2px dashed var(--border)' }}>
                <Sparkles className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
                <p className="text-sm" style={{ color: 'var(--subtle)' }}>Summary will appear here</p>
              </div>
            )}
          </div>
          {summary && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Button size="sm" variant="outline" onClick={() => navigate('/quiz')} fullWidth>
                <HelpCircle className="w-3.5 h-3.5" /> Generate Quiz from this Summary
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
