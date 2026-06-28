import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { API } from '../lib/utils';

const features: {
  title: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
    {
      title: "Secure access",
      desc: "Token-based sign in and protected dashboard routes.",
      Icon: ShieldCheck,
    },
    {
      title: "Fast workflow",
      desc: "Login, land on dashboard, continue your work.",
      Icon: Sparkles,
    },
  ];

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.jwtToken);
      localStorage.setItem('user', JSON.stringify(data.email));
      const sRes = await fetch(`${API}/user/subjects`, { headers: { Authorization: `Bearer ${data.jwtToken}` } });
      const sData = await sRes.json();
      navigate(!sData.subjects?.length ? '/subjects' : '/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden border-r p-8 lg:flex lg:flex-col lg:justify-between" style={{ borderColor: 'var(--border)', background: 'linear-gradient(180deg, rgba(255,255,255,.8), rgba(245,246,250,.92))' }}>
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--primary)' }}>
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">AI Study Planner</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Separate login page, same design system</p>
              </div>
            </Link>

            <div className="mt-16 max-w-lg">
              <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: 'var(--primary)' }}>Login</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight">Sign in to continue your study plan.</h1>
              <p className="mt-4 text-base" style={{ color: 'var(--muted)' }}>
                Keep the interface quiet. Keep the action clear. Do not mix onboarding with authentication.
              </p>
            </div>

            <div className="mt-10 grid gap-4 max-w-lg sm:grid-cols-2">
              {features.map(({ title, desc, Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border bg-white p-4 shadow-sm"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: 'var(--primary-light)' }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: 'var(--primary)' }}
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    {title}
                  </p>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: 'var(--muted)' }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            <Link to="/" className="inline-flex items-center gap-2 font-medium" style={{ color: 'var(--text-2)' }}>
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        </aside>

        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-6 text-left lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--primary)' }}>
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">AI Study Planner</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Clean, minimal login</p>
                </div>
              </div>
            </div>

            <div className="auth-card p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: 'var(--primary)' }}>Welcome back</p>
                <h2 className="mt-2 text-2xl font-bold">Login</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Enter your credentials to continue.</p>
              </div>

              {error && <div className="mb-4 rounded-lg border p-3 text-sm font-medium" style={{ background: 'var(--error-light)', color: 'var(--error)', borderColor: 'var(--error-border)' }}>{error}</div>}

              <form onSubmit={submit} className="space-y-4">
                <Input type="email" label="Email address" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <div className="relative">
                  <Input type={show ? 'text' : 'password'} label="Password" placeholder="Your password" value={pw} onChange={e => setPw(e.target.value)} required />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 bottom-[0.65rem]" style={{ color: 'var(--muted)' }} aria-label={show ? 'Hide password' : 'Show password'}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                    <input type="checkbox" className="s-checkbox" /> Remember me
                  </label>
                  <button type="button" onClick={() => navigate('/forgot-password')} className="link">Forgot password?</button>
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">Sign in</Button>


              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--subtle)' }}>or</span>
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              </div>

              <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
                No account? <button onClick={() => navigate('/register')} className="link">Create one</button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
