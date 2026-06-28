import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import Summarizer from './pages/Summarizer';
import SummaryHistory from './pages/SummaryHistory';
import SchedulerDashboard from './pages/SchedulerDashboard';
import QuizPage from './pages/QuizPage';
import Subjects from './pages/Subjects';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

const isAuth = () => !!localStorage.getItem('token');

const Private = ({ children }: { children: React.ReactNode }) =>
  isAuth() ? <>{children}</> : <Navigate to="/login" replace />;

const Guest = ({ children }: { children: React.ReactNode }) =>
  !isAuth() ? <>{children}</> : <Navigate to="/dashboard" replace />;

const Layout = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Guest><Login /></Guest>} />
        <Route path="/register" element={<Guest><Register /></Guest>} />
        <Route path="/forgot-password" element={<Guest><ForgotPassword /></Guest>} />
        <Route path="/reset-password/:token" element={<Guest><ResetPassword /></Guest>} />

        <Route path="/dashboard" element={<Private><Layout><Dashboard /></Layout></Private>} />
        <Route path="/summarizer" element={<Private><Layout><Summarizer /></Layout></Private>} />
        <Route path="/summarizer/history" element={<Private><Layout><SummaryHistory /></Layout></Private>} />
        <Route path="/scheduler" element={<Private><Layout><SchedulerDashboard /></Layout></Private>} />
        <Route path="/quiz" element={<Private><Layout><QuizPage /></Layout></Private>} />
        <Route path="/subjects" element={<Private><Layout><Subjects /></Layout></Private>} />
        <Route path="/profile" element={<Private><Layout><ProfilePage /></Layout></Private>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
