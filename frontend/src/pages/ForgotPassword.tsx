import { useState } from 'react';
import { Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { API } from '../lib/utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSent(true);

      if (data.url) {
        setTimeout(() => {
          window.open(data.url, "_blank");
        }, 1000);
      }

    } catch {
      setError("Unable to generate reset link.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4" style={{ background: 'var(--primary)' }}><Zap className="w-5 h-5 text-white" /></div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Reset password</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>We'll send you a reset link</p>
        </div>
        <div className="auth-card">
          {
            error && (
              <div
                className="mb-4 rounded-lg border p-3 text-sm"
                style={{
                  background: "#FEE2E2",
                  color: "#B91C1C",
                }}
              >
                {error}
              </div>
            )
          }
          {sent ? (
            <div className="text-center py-2">
              <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--success)' }} />
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Check your email</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Reset link sent successfully.</p>
              <button onClick={() => navigate('/login')} className="text-sm link">← Back to sign in</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Input type="email" label="Email address" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <Button type="submit" fullWidth loading={loading} size="lg">Send reset link</Button>
            </form>
          )}
        </div>
        {!sent && <p className="text-center text-sm mt-5"><button onClick={() => navigate('/login')} className="link">← Back to sign in</button></p>}
      </div>
    </div>
  );
}
