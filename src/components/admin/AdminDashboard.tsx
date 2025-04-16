
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  FolderKanban, 
  User, 
  Home, 
  Mail, 
  Share2,
  FileText,
  Briefcase,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const StatusCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <div className="bg-card p-6 rounded-lg border border-border">
    <h3 className="text-muted-foreground font-medium mb-2">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const QuickAccessCard = ({ 
  icon, 
  title, 
  description, 
  path 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  path: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(path)} 
      className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
    >
      <div className="mb-4 p-3 bg-primary/10 w-fit rounded-md text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex items-center text-sm text-primary font-medium">
        <span>Manage</span>
        <ArrowRight size={14} className="ml-1" />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your content management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Total Projects" value="12" color="text-accent-teal" />
        <StatusCard title="Experiences" value="4" color="text-accent-coral" />
        <StatusCard title="Social Links" value="5" color="text-accent-purple" />
        <StatusCard title="Skills" value="8" color="text-primary" />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            icon={<FolderKanban size={24} />}
            title="Projects"
            description="Manage your portfolio projects"
            path="/admin/projects"
          />
          <QuickAccessCard
            icon={<Briefcase size={24} />}
            title="Experience"
            description="Update your work history and professional experience"
            path="/admin/experiences"
          />
          <QuickAccessCard
            icon={<FileText size={24} />}
            title="Resume"
            description="Upload and manage your resume"
            path="/admin/resume"
          />
          <QuickAccessCard
            icon={<Sparkles size={24} />}
            title="Skills"
            description="Manage your technical and professional skills"
            path="/admin/skills"
          />
          <QuickAccessCard
            icon={<User size={24} />}
            title="About"
            description="Update your personal information and skills"
            path="/admin/about"
          />
          <QuickAccessCard
            icon={<Home size={24} />}
            title="Hero Section"
            description="Edit your homepage hero section"
            path="/admin/hero"
          />
          <QuickAccessCard
            icon={<Mail size={24} />}
            title="Contact"
            description="Configure contact form and view messages"
            path="/admin/contact"
          />
          <QuickAccessCard
            icon={<Share2 size={24} />}
            title="Social Links"
            description="Manage your social media profiles"
            path="/admin/social"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
