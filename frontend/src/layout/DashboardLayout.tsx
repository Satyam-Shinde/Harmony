import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, History, Calendar,
  HelpCircle, BookOpen, User, LogOut, Zap,
} from 'lucide-react';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/summarizer', icon: FileText, label: 'Summarizer', end: true },
  { to: '/summarizer/history', icon: History, label: 'History', end: false },
  { to: '/scheduler', icon: Calendar, label: 'Scheduler', end: false },
  { to: '/quiz', icon: HelpCircle, label: 'Quiz', end: false },
  { to: '/subjects', icon: BookOpen, label: 'Subjects', end: false },
  { to: '/profile', icon: User, label: 'Profile', end: false },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const userEmail = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  const initials = userEmail ? String(userEmail)[0].toUpperCase() : '?';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Sidebar ── */}
      <aside
        className="w-56 flex-shrink-0 fixed top-0 left-0 h-full flex flex-col z-20"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[0.9375rem]" style={{ color: 'var(--text)' }}>Harmony</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-100 ${isActive
                  ? 'text-[#4F46E5] bg-[#EEF2FF]'
                  : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
          {userEmail && (
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white flex-shrink-0" style={{ background: 'var(--primary)' }}>
                {initials}
              </div>
              <span className="text-xs font-medium truncate" style={{ color: 'var(--text-2)' }}>{userEmail}</span>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-100 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2]"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto" style={{ marginLeft: '14rem' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
