import { useEffect, useState } from 'react';
import { User, FileText, HelpCircle, Calendar, CheckSquare, TrendingUp } from 'lucide-react';
import { API, getToken, fmtDate, levelLabel, scoreBadge, diffBadge } from '../lib/utils';

interface Profile { name: string; email: string; hoursPerDay: number; subjects: any[]; }

const ProgressBar = ({ pct, color = 'var(--primary)' }: { pct: number; color?: string }) => (
  <div className="progress-track">
    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile]         = useState<Profile | null>(null);
  const [summaryCount, setSummaryCount] = useState(0);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [schedHistory, setSchedHist]  = useState<any[]>([]);
  const token = getToken();

  useEffect(() => {
    const h = { Authorization: `Bearer ${token}` };
    fetch(`${API}/user/profile`, { headers: h }).then(r => r.json()).then(setProfile).catch(() => {});
    fetch(`${API}/summarizer/history`, { headers: h }).then(r => r.json()).then(d => setSummaryCount(d.count || 0)).catch(() => {});
    fetch(`${API}/quiz/history`, { headers: h }).then(r => r.json()).then(d => setQuizHistory(d.history || [])).catch(() => {});
    fetch(`${API}/scheduler/history`, { headers: h }).then(r => r.json()).then(d => setSchedHist(d.history || [])).catch(() => {});
  }, []);

  const quizAccuracy = quizHistory.length
    ? Math.round(quizHistory.reduce((a, q) => a + (q.scorePercent || 0), 0) / quizHistory.length)
    : 0;

  const completedToday = schedHistory[0]?.completedTasks ?? 0;
  const totalToday     = schedHistory[0]?.totalTasks     ?? 0;
  const taskPct        = totalToday ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Your learning overview and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* User card */}
          <div className="card p-5 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--primary-light)' }}>
              <User className="w-7 h-7" style={{ color: 'var(--primary)' }} />
            </div>
            {profile ? (
              <>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{profile.name}</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{profile.email}</p>
                <div className="divider my-3" />
                <div className="space-y-1.5 text-left">
                  {[
                    { label: 'Subjects',      val: profile.subjects?.length ?? 0 },
                    { label: 'Hours/Day',     val: profile.hoursPerDay },
                    { label: 'Summaries',     val: summaryCount },
                    { label: 'Quizzes Taken', val: quizHistory.length },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</p>}
          </div>

          {/* Progress */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Learning Progress</span>
            </div>
            <div className="divider mb-4" />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>Task Completion</span>
                  <span className="text-xs font-semibold" style={{ color: taskPct >= 70 ? 'var(--success)' : 'var(--primary)' }}>{taskPct}%</span>
                </div>
                <ProgressBar pct={taskPct} color={taskPct >= 70 ? 'var(--success)' : 'var(--primary)'} />
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{completedToday}/{totalToday} tasks (last schedule)</p>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>Quiz Accuracy</span>
                  <span className="text-xs font-semibold" style={{ color: quizAccuracy >= 70 ? 'var(--success)' : quizAccuracy >= 40 ? 'var(--warning)' : 'var(--error)' }}>{quizAccuracy}%</span>
                </div>
                <ProgressBar pct={quizAccuracy} color={quizAccuracy >= 70 ? 'var(--success)' : quizAccuracy >= 40 ? 'var(--warning)' : 'var(--error)'} />
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Across {quizHistory.length} attempt{quizHistory.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: FileText,    label: 'Summaries',  val: summaryCount,       color: 'var(--primary)' },
              { icon: HelpCircle,  label: 'Quizzes',    val: quizHistory.length, color: '#8B5CF6' },
              { icon: CheckSquare, label: 'Accuracy',   val: `${quizAccuracy}%`, color: 'var(--success)' },
              { icon: Calendar,    label: 'Schedules',  val: schedHistory.length,color: 'var(--warning)' },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="card p-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{val}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Quiz history */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Quiz History</span>
            </div>
            {!quizHistory.length ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No quizzes taken yet</p>
            ) : (
              <>
                <div className="grid px-5 py-2 text-xs font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: '1fr 5.5rem 5rem 5.5rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--surface-2)' }}>
                  <span>Subject</span><span>Difficulty</span><span>Score</span><span>Date</span>
                </div>
                {quizHistory.slice(0, 10).map((q, i) => (
                  <div key={i} className="grid px-5 py-3 items-center row-hover" style={{ gridTemplateColumns: '1fr 5.5rem 5rem 5.5rem', borderBottom: i < Math.min(quizHistory.length, 10) - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{q.subject}</span>
                    <span className={diffBadge(q.difficulty)}>{q.difficulty}</span>
                    <span className={scoreBadge(q.scorePercent ?? Math.round((q.score/q.totalQuestions)*100))}>{q.scorePercent ?? Math.round((q.score/q.totalQuestions)*100)}%</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{fmtDate(q.date)}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Schedule history */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Schedule History</span>
            </div>
            {!schedHistory.length ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No schedules generated yet</p>
            ) : (
              schedHistory.slice(0, 8).map((s, i) => {
                const pct = s.totalTasks ? Math.round((s.completedTasks / s.totalTasks) * 100) : 0;
                return (
                  <div key={i} className="flex items-center justify-between px-5 py-3 row-hover" style={{ borderBottom: i < Math.min(schedHistory.length, 8) - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>{s.date}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 progress-track">
                        <div className={`progress-fill ${pct === 100 ? 'progress-green' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.completedTasks}/{s.totalTasks}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
