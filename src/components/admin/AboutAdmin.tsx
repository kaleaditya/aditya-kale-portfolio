
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAbout, AboutData } from '@/hooks/useAbout';
import { useSkills, Skill } from '@/hooks/useSkills';
import { toast } from '@/hooks/use-toast';

const AboutAdmin = () => {
  const { aboutData, loading: aboutLoading, fetchActiveAbout, createAbout, updateAbout } = useAbout();
  const { skills, fetchSkills } = useSkills();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<Partial<AboutData>>({
    title: 'About Me',
    subtitle: 'Web Developer & Designer',
    bio: 'I am a passionate web developer with expertise in React, Node.js, and UI/UX design. With over 5 years of experience building modern web applications, I focus on creating responsive, accessible, and performant user experiences.',
    education: 'Master\'s Degree in Computer Science',
    experience_years: 4,
    awards: 'Best Web Design 2023',
    project_count: 20,
    is_active: true
  });
  
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const aboutData = await fetchActiveAbout();
      await fetchSkills();
      
      if (aboutData) {
        setFormData({
          title: aboutData.title,
          subtitle: aboutData.subtitle,
          bio: aboutData.bio,
          education: aboutData.education,
          experience_years: aboutData.experience_years,
          awards: aboutData.awards || '',
          project_count: aboutData.project_count,
          is_active: aboutData.is_active
        });
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    setSkillsByCategory(grouped);
  }, [skills]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (name === 'experience_years' || name === 'project_count') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const saveChanges = async () => {
    if (!formData.title || !formData.subtitle || !formData.bio || !formData.education) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (aboutData) {
        await updateAbout(aboutData.id, formData);
      } else {
        await createAbout(formData as Omit<AboutData, 'id' | 'created_at' | 'updated_at'>);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Section</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2" disabled={loading}>
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Heading</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="About Me"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleInputChange}
                placeholder="Your title or role"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              placeholder="Write something about yourself..."
              rows={6}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input 
                id="education" 
                name="education"
                value={formData.education || ''}
                onChange={handleInputChange}
                placeholder="Your education"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input 
                id="experience_years" 
                name="experience_years"
                type="number"
                value={formData.experience_years || 0}
                onChange={handleInputChange}
                min={0}
              />
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="awards">Awards (optional)</Label>
              <Input 
                id="awards" 
                name="awards"
                value={formData.awards || ''}
                onChange={handleInputChange}
                placeholder="Your awards"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_count">Project Count</Label>
              <Input 
                id="project_count" 
                name="project_count"
                type="number"
                value={formData.project_count || 0}
                onChange={handleInputChange}
                min={0}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Skills</h2>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin/skills'}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Manage Skills
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(skillsByCategory).length > 0 ? (
              Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-medium">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <div 
                        key={skill.id}
                        className="px-3 py-2 bg-secondary rounded-md flex items-center gap-2"
                      >
                        <span>{skill.name}</span>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {skill.level}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No skills added yet. Go to the Skills section to add skills.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
