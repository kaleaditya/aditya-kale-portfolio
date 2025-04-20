
import React, { useState } from 'react';
import { useNavigate, Navigate, Routes, Route } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProjectsAdmin from '@/components/admin/ProjectsAdmin';
import AboutAdmin from '@/components/admin/AboutAdmin';
import HeroAdmin from '@/components/admin/HeroAdmin';
import ContactAdmin from '@/components/admin/ContactAdmin';
import SocialAdmin from '@/components/admin/SocialAdmin';
import ExperiencesAdmin from '@/components/admin/ExperiencesAdmin';
import ResumeAdmin from '@/components/admin/ResumeAdmin';
import SkillsAdmin from '@/components/admin/SkillsAdmin';

// Simple authentication state (replace with proper auth later)
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });

  const login = (password: string) => {
    // Simple password check (replace with proper auth)
    if (password === 'Adityakale19') {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 glass-dark rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Admin Login</h1>
        {error && <p className="text-destructive mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/80 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar onLogout={logout} />
        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/projects" element={<ProjectsAdmin />} />
            <Route path="/about" element={<AboutAdmin />} />
            <Route path="/hero" element={<HeroAdmin />} />
            <Route path="/contact" element={<ContactAdmin />} />
            <Route path="/social" element={<SocialAdmin />} />
            <Route path="/experiences" element={<ExperiencesAdmin />} />
            <Route path="/resume" element={<ResumeAdmin />} />
            <Route path="/skills" element={<SkillsAdmin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Admin = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route index element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default Admin;
