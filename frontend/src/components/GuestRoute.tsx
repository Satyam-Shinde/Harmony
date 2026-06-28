import { Navigate } from 'react-router-dom';
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}
