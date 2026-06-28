import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, CheckCircle2, LayoutDashboard, Menu, Sparkles, SquarePlay, Zap } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const features = [
  {
    icon: CalendarDays,
    title: 'Smart Scheduler',
    desc: 'Auto-builds a realistic study plan around your deadlines and routine.',
  },
  {
    icon: Sparkles,
    title: 'AI Quiz Generator',
    desc: 'Turns your topics into quick practice questions with instant feedback.',
  },
  {
    icon: BookOpen,
    title: 'Notes Summarizer',
    desc: 'Condenses long notes into clean revision points in seconds.',
  },
  // {
  //   icon: ClipboardList,
  //   title: 'Assignment Tracker',
  //   desc: 'Keeps tasks, due dates, and progress visible in one place.',
  // },
  // {
  //   icon: Target,
  //   title: 'Goal Tracking',
  //   desc: 'Shows focus areas, completion rates, and what to do next.',
  // },
  // {
  //   icon: Users,
  //   title: 'Simple Collaboration',
  //   desc: 'Makes group study and shared planning easier to manage.',
  // },
];

const steps = [
  'Add your courses and deadlines',
  'Generate a study plan with AI',
  'Track progress and revise faster',
];

const previews = [
  { title: 'Dashboard', stat: 'Focus score 82%', note: 'Daily plan, progress, and quick actions.' },
  { title: 'Scheduler', stat: '9 tasks planned', note: 'Balanced timeline with priority blocks.' },
  { title: 'Notes Hub', stat: '12 summaries ready', note: 'Readable revision cards and saved notes.' },
];

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: 'var(--primary)' }}>{eyebrow}</p>
      <h2 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight" style={{ color: 'var(--text)' }}>{title}</h2>
      <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-30 border-b" style={{ background: 'rgba(245,246,250,.85)', borderColor: 'var(--border)', backdropFilter: 'blur(18px)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--primary)' }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Harmony: AI Study Planner</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Minimal planning for students</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>Features</a>
            <a href="#how" className="rounded-lg px-3 py-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>How it works</a>
            <a href="#preview" className="rounded-lg px-3 py-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>Preview</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <BadgeCheck className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
                Clean dashboard-style experience
              </div>
              <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--text)' }}>
                AI-powered study planning that stays simple.
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
                Plan your subjects, generate smarter study blocks, and keep assignments, notes, and revisions in one focused workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">Login</Button>
                </Link>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ['Fast setup', 'Add subjects in minutes'],
                  ['Clear focus', 'Daily plan at a glance'],
                  ['Less clutter', 'One consistent layout'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border bg-[var(--surface)] p-4 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-24 w-24 rounded-full blur-3xl" style={{ background: 'rgba(79,70,229,.16)' }} />
              <div className="absolute -right-4 top-0 h-28 w-28 rounded-full blur-3xl" style={{ background: 'rgba(16,185,129,.12)' }} />
              <Card className="relative overflow-hidden p-4 sm:p-5">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-semibold">Dashboard preview</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Same visual language as the app</p>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    Live view
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
                  <div className="rounded-2xl border p-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
                      <LayoutDashboard className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                      <div>
                        <p className="text-xs font-semibold">Today</p>
                        <p className="text-[11px]" style={{ color: 'var(--muted)' }}>4 focused sessions</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['Dashboard', 'Scheduler', 'Summarizer', 'Quiz'].map((item, idx) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ background: idx === 0 ? 'var(--primary)' : 'var(--border-2)' }} />
                          <p className="text-sm font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ['Study streak', '12 days'],
                        ['Tasks done', '18 / 24'],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</p>
                          <p className="mt-2 text-2xl font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Next study block</p>
                          <p className="text-xs" style={{ color: 'var(--muted)' }}>Linear, readable, and low noise</p>
                        </div>
                        <SquarePlay className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          ['Math revision', '45 min'],
                          ['AI quiz practice', '20 min'],
                          ['Assignment update', '30 min'],
                        ].map(([task, time], idx) => (
                          <div key={task} className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] px-3 py-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-4 w-4" style={{ color: idx === 0 ? 'var(--success)' : 'var(--subtle)' }} />
                              <p className="text-sm font-medium">{task}</p>
                            </div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>{time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Features"
            title="Everything stays in one system."
            desc="Each page uses the same layout logic, same spacing, and same card style so the app feels connected instead of fragmented."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-5 transition-transform duration-150 hover:-translate-y-0.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--primary-light)' }}>
                  <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="How it works"
            title="Three clear steps. No clutter."
            desc="The flow is simple enough for a first-time user and structured enough to keep the interface predictable."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  0{index + 1}
                </div>
                <p className="mt-4 text-base font-semibold">{step}</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                  {index === 0 && 'Keep your courses and deadlines in a clean setup.'}
                  {index === 1 && 'Let the system turn your inputs into a practical plan.'}
                  {index === 2 && 'Review progress, adjust, and stay consistent.'}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Preview"
            title="The pages follow the same visual base."
            desc="This avoids a different look on every screen. Users keep the same mental model when they move from dashboard to scheduler to notes."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {previews.map((item) => (
              <Card key={item.title} className="overflow-hidden p-0">
                <div className="border-b p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{item.note}</p>
                    </div>
                    <div className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {item.stat}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="rounded-2xl border p-4" style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--primary)' }} />
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-2)' }} />
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-2)' }} />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-3 w-2/3 rounded-full" style={{ background: 'var(--primary-light)' }} />
                      <div className="h-20 rounded-2xl bg-[var(--surface-2)]" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 rounded-2xl bg-[var(--surface-2)]" />
                        <div className="h-16 rounded-2xl bg-[var(--surface-2)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: 'var(--primary)' }}>Call to action</p>
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Start planning now. Stop wasting time on scattered notes.</h2>
                <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--muted)' }}>
                  Use one clean workspace for study blocks, notes, quizzes, and assignment tracking.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/register"><Button size="lg">Start Planning Now</Button></Link>
                  <Link to="/login"><Button variant="secondary" size="lg">Login</Button></Link>
                </div>
              </div>
              <div className="flex items-center justify-center border-t p-6 lg:border-l lg:border-t-0" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                <div className="space-y-4 text-center">
                  <Menu className="mx-auto h-8 w-8" style={{ color: 'var(--primary)' }} />
                  <p className="text-sm font-semibold">Minimal by design</p>
                  <p className="max-w-xs text-sm" style={{ color: 'var(--muted)' }}>
                    Same card styles, same spacing, same navigation behavior. That is the whole point.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="mt-12 border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p style={{ color: 'var(--muted)' }}>AI Study Planner. Final year project UI concept.</p>
          <div className="flex items-center gap-4">
            <a href="#features" className="font-medium" style={{ color: 'var(--text-2)' }}>About</a>
            <a href="#preview" className="font-medium" style={{ color: 'var(--text-2)' }}>Contact</a>
            <a href="#" className="font-medium" style={{ color: 'var(--text-2)' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
