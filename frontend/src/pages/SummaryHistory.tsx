import { useEffect, useState } from 'react';
import { Archive, Eye, Trash2, RefreshCw, X, FileText } from 'lucide-react';
import Button from '../components/Button';
import { API, getToken, fmtDate, fmtTime } from '../lib/utils';

interface Summary { _id: string; originalText: string; summaryText: string; subject?: string; sourceType: string; fileName?: string; createdAt: string; }

export default function SummaryHistory() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState<Summary | null>(null);
  const token = getToken();

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/summarizer/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSummaries(data.summaries || []);
    } catch { console.error('fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Delete this summary?')) return;
    await fetch(`${API}/summarizer/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setSummaries(p => p.filter(s => s._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Summary History</h1>
          <p className="page-sub">{summaries.length} saved summaries</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} loading={loading}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {!summaries.length && !loading ? (
        <div className="card empty-state">
          <Archive className="w-9 h-9" style={{ color: 'var(--border-2)' }} />
          <p className="font-medium text-sm" style={{ color: 'var(--text-2)' }}>No summaries yet</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Summaries you generate will appear here</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: '2.5rem 1fr 7rem 5rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--surface-2)' }}>
            <span>#</span><span>Summary</span><span>Date</span><span className="text-right">Actions</span>
          </div>
          {summaries.map((s, i) => (
            <div key={s._id} className="grid px-5 py-4 items-center row-hover" style={{ gridTemplateColumns: '2.5rem 1fr 7rem 5rem', borderBottom: i < summaries.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-xs font-mono" style={{ color: 'var(--subtle)' }}>{String(i+1).padStart(2,'0')}</span>
              <div className="pr-4 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  {s.subject && <span className="badge badge-blue">{s.subject}</span>}
                  <span className="badge badge-gray">{s.sourceType === 'file' ? `📄 ${s.fileName || 'file'}` : '✏️ text'}</span>
                </div>
                <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{s.summaryText}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-2)' }}>{fmtDate(s.createdAt)}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{fmtTime(s.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => setSelected(s)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}><Eye className="w-4 h-4" /></button>
                <button onClick={() => del(s._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" style={{ boxShadow: 'var(--shadow-xl)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="font-semibold" style={{ color: 'var(--text)' }}>Summary Details</span>
                {selected.subject && <span className="badge badge-blue">{selected.subject}</span>}
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F0F2F5]" style={{ color: 'var(--muted)' }}><X className="w-4 h-4" /></button>
            </div>
            <div className="divider mb-4" />
            {selected.sourceType !== 'file' && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>Original Text</p>
                <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{selected.originalText}</div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>AI Summary</p>
              <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-border)', color: 'var(--text)' }}>{selected.summaryText}</div>
            </div>
            <div className="flex justify-end mt-5"><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
