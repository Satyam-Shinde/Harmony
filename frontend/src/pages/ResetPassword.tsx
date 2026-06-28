import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { API } from '../lib/utils';

export default function ResetPassword() {
  const [pw, setPw]     = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [done, setDone]     = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (pw !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/reset-password/${token}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password: pw }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to reset'); setLoading(false); return; }
      setDone(true);
    } catch { setError('Something went wrong.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4" style={{ background: 'var(--primary)' }}><Zap className="w-5 h-5 text-white" /></div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>New password</h1>
        </div>
        <div className="auth-card">
          {done ? (
            <div className="text-center py-2">
              <p className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Password updated successfully!</p>
              <Button fullWidth size="lg" onClick={() => navigate('/login')}>Sign in</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && <div className="p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--error-light)', color: 'var(--error)' }}>{error}</div>}
              <Input type="password" label="New Password"      placeholder="New password"    value={pw}      onChange={e => setPw(e.target.value)}      required />
              <Input type="password" label="Confirm Password"  placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              <Button type="submit" fullWidth loading={loading} size="lg">Reset password</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
