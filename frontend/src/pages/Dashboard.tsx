import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, HelpCircle, BookOpen,
  AlertTriangle, TrendingUp, CheckCircle, Clock,
  ChevronRight, Wand2,
} from 'lucide-react';
import Button from '../components/Button';
import { API, getToken, fmtDate, scoreBadge } from '../lib/utils';

interface DashData {
  user:          { name: string; subjects: number; hoursPerDay: number };
  today:         { date: string; hasSchedule: boolean; totalTasks: number; completedTasks: number; taskPercent: number; pendingTasks: any[] };
  stats:         { summaryCount: number; quizAttempts: number; quizAccuracy: number };
  subjectStats:  { name: string; avgScore: number; attempts: number }[];
  staleSubs:     string[];
  recentActivity: { type: string; subject: string; score: number; date: string }[];
}

function StatCard({ icon: Icon, label, value, color = 'var(--primary)' }: { icon: any; label: string; value: string | number; color?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData]       = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/dashboard`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Loading dashboard…</span>
      </div>
    );
  }

  if (!data) return <p className="text-sm" style={{ color: 'var(--muted)' }}>Failed to load dashboard.</p>;

  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const weakSubject = data.subjectStats.sort((a, b) => a.avgScore - b.avgScore)[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {greeting}, {data.user.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {fmtDate(new Date().toISOString())} · {data.user.subjects} subject{data.user.subjects !== 1 ? 's' : ''} · {data.user.hoursPerDay}h/day
        </p>
      </div>

      {/* Stale subject warning */}
      {data.staleSubs.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--warning-light)', border: '1px solid var(--warning-border)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Subjects without summaries</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
              <strong>{data.staleSubs.join(', ')}</strong> — generate a summary to unlock quizzes for these.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/summarizer')}>
            Summarize <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText}    label="Total Summaries"  value={data.stats.summaryCount}  color="var(--primary)" />
        <StatCard icon={HelpCircle}  label="Quizzes Taken"    value={data.stats.quizAttempts}  color="#8B5CF6" />
        <StatCard icon={TrendingUp}  label="Quiz Accuracy"    value={`${data.stats.quizAccuracy}%`} color="var(--success)" />
        <StatCard icon={BookOpen}    label="Subjects"         value={data.user.subjects}        color="var(--warning)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Today's Study Plan</span>
            </div>
            {data.today.hasSchedule && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {data.today.completedTasks}/{data.today.totalTasks} done
              </span>
            )}
          </div>

          {data.today.hasSchedule ? (
            <>
              <div className="progress-track mb-4">
                <div className="progress-fill" style={{ width: `${data.today.taskPercent}%` }} />
              </div>
              {data.today.pendingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)' }} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--success)' }}>All tasks completed! 🎉</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.today.pendingTasks.slice(0, 4).map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                      <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{t.subject}</span>
                      <span className="badge badge-gray">{t.duration_minutes}m</span>
                    </div>
                  ))}
                  {data.today.pendingTasks.length > 4 && (
                    <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                      +{data.today.pendingTasks.length - 4} more tasks
                    </p>
                  )}
                </div>
              )}
              <Button variant="outline" size="sm" fullWidth className="mt-4" onClick={() => navigate('/scheduler')}>
                View full schedule <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <div className="empty-state py-8">
              <Calendar className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
              <p className="font-medium text-sm" style={{ color: 'var(--text-2)' }}>No schedule for today</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Generate one to plan your study session</p>
              <Button size="sm" onClick={() => navigate('/scheduler')} icon={<Wand2 className="w-3.5 h-3.5" />}>
                Generate Schedule
              </Button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Weak subject recommendation */}
          {weakSubject && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--error)' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Needs Attention</span>
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-2)' }}>
                <strong>{weakSubject.name}</strong>
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Avg score: {weakSubject.avgScore}% over {weakSubject.attempts} quiz{weakSubject.attempts !== 1 ? 'zes' : ''}
              </p>
              <div className="progress-track mb-3">
                <div className={`progress-fill ${weakSubject.avgScore < 50 ? 'progress-red' : 'progress-green'}`} style={{ width: `${weakSubject.avgScore}%` }} />
              </div>
              <Button size="sm" variant="outline" fullWidth onClick={() => navigate('/quiz')}>
                Take a Quiz <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Quick actions */}
          <div className="card p-5">
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: 'New Summary',      icon: FileText,   to: '/summarizer' },
                { label: 'Take a Quiz',      icon: HelpCircle, to: '/quiz'       },
                { label: 'View Schedule',    icon: Calendar,   to: '/scheduler'  },
              ].map(({ label, icon: Icon, to }) => (
                <button key={to} onClick={() => navigate(to)}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[#374151] hover:bg-[#F9FAFB]"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  {label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      {data.recentActivity.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Recent Quiz Activity</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {data.recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 row-hover">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{a.subject}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{fmtDate(a.date)}</p>
                </div>
                <span className={scoreBadge(a.score)}>{a.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
