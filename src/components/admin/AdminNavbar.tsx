
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell } from 'lucide-react';

interface AdminNavbarProps {
  onLogout: () => void;
}

const AdminNavbar = ({ onLogout }: AdminNavbarProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-card border-b border-border p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Content Management System</h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Settings size={18} />
        </button>
        
        <div className="h-6 w-px bg-border"></div>
        
        <button 
          onClick={() => {
            onLogout();
            navigate('/admin');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-destructive/20 text-destructive transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
