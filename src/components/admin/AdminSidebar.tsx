
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  User, 
  Home, 
  Mail, 
  Share2, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2 rounded-md transition-colors
      ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-foreground/80'}
      ${collapsed ? 'justify-center' : ''}
    `}
  >
    <div className="w-5 h-5 shrink-0">{icon}</div>
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <aside className={`
      bg-card border-r border-border h-screen 
      transition-all duration-300 flex flex-col
      ${collapsed ? 'w-[70px]' : 'w-[250px]'}
    `}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && <h2 className="text-xl font-bold text-primary">Admin</h2>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-secondary transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1">
        <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/admin/projects" icon={<FolderKanban size={18} />} label="Projects" collapsed={collapsed} />
        <NavItem to="/admin/about" icon={<User size={18} />} label="About" collapsed={collapsed} />
        <NavItem to="/admin/hero" icon={<Home size={18} />} label="Hero" collapsed={collapsed} />
        <NavItem to="/admin/contact" icon={<Mail size={18} />} label="Contact" collapsed={collapsed} />
        <NavItem to="/admin/social" icon={<Share2 size={18} />} label="Social" collapsed={collapsed} />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
