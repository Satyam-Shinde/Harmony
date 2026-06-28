import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-sm">
        <p className="text-8xl font-black mb-4" style={{ color: 'var(--border-2)' }}>404</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Page not found</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>The page you're looking for doesn't exist.</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
          <Button onClick={() => navigate('/dashboard')}>Home</Button>
        </div>
      </div>
    </div>
  );
}
