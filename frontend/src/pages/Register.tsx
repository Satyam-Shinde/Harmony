import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { API } from '../lib/utils';

export default function Register() {
  const [f, setF] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (f.password !== f.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/signup`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: f.name, email: f.email, password: f.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); setLoading(false); return; }
      navigate('/login');
    } catch { setError('Something went wrong.'); }
    setLoading(false);
  };

  const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4" style={{ background: 'var(--primary)' }}><Zap className="w-5 h-5 text-white" /></div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Create account</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Start your AI-powered study journey</p>
        </div>
        <div className="auth-card">
          {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--error-light)', color: 'var(--error)', border: '1px solid var(--error-border)' }}>{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <Input type="text"     label="Full Name"        placeholder="Your name"         value={f.name}     onChange={up('name')}     required />
            <Input type="email"    label="Email address"    placeholder="you@example.com"   value={f.email}    onChange={up('email')}    required />
            <Input type="password" label="Password"         placeholder="Create a password" value={f.password} onChange={up('password')} required />
            <Input type="password" label="Confirm Password" placeholder="Repeat password"   value={f.confirm}  onChange={up('confirm')}  required />
            <Button type="submit" fullWidth loading={loading} size="lg">Create account</Button>
          </form>
        </div>
        <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
          Have an account? <button onClick={() => navigate('/login')} className="link">Sign in</button>
        </p>
      </div>
    </div>
  );
}
