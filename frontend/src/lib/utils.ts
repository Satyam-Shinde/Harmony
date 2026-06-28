export const API = 'http://localhost:8080/api';

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const getToken = () => localStorage.getItem('token') || '';

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

export const levelLabel: Record<number, string> = {
  1: 'Novice', 2: 'Apprentice', 3: 'Scholar', 4: 'Expert', 5: 'Master',
};

export const diffBadge = (d: string) => {
  if (d === 'easy')   return 'badge badge-green';
  if (d === 'medium') return 'badge badge-yellow';
  if (d === 'hard')   return 'badge badge-red';
  return 'badge badge-gray';
};

export const scoreBadge = (pct: number) => {
  if (pct >= 70) return 'badge badge-green';
  if (pct >= 40) return 'badge badge-yellow';
  return 'badge badge-red';
};
