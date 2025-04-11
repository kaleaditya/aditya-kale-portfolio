
import React, { useState } from 'react';
import { Save, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Sample skill type
interface Skill {
  id: string;
  name: string;
  proficiency: number;
}

const AboutAdmin = () => {
  const [title, setTitle] = useState('About Me');
  const [subtitle, setSubtitle] = useState('Web Developer & Designer');
  const [bio, setBio] = useState(
    'I am a passionate web developer with expertise in React, Node.js, and UI/UX design. With over 5 years of experience building modern web applications, I focus on creating responsive, accessible, and performant user experiences.'
  );
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', proficiency: 90 },
    { id: '2', name: 'TypeScript', proficiency: 85 },
    { id: '3', name: 'UI/UX Design', proficiency: 80 },
    { id: '4', name: 'Node.js', proficiency: 75 },
  ]);
  
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 75 });
  
  const handleSkillChange = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };
  
  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([
        ...skills, 
        { ...newSkill, id: Date.now().toString() }
      ]);
      setNewSkill({ name: '', proficiency: 75 });
    }
  };
  
  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };
  
  const saveChanges = () => {
    // Here we would save to a database or local storage
    console.log('Saving changes:', { title, subtitle, bio, skills });
    // Show success message
    alert('Changes saved successfully!');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Section</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="About Me"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Your title or role"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              rows={6}
            />
          </div>
        </div>
        
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold">Skills</h2>
          
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="grid gap-4 sm:grid-cols-[1fr,auto,auto]">
                <div className="space-y-2">
                  <Label htmlFor={`skill-name-${skill.id}`}>Skill Name</Label>
                  <Input 
                    id={`skill-name-${skill.id}`}
                    value={skill.name}
                    onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                    placeholder="Skill name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`skill-proficiency-${skill.id}`}>Proficiency %</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id={`skill-proficiency-${skill.id}`}
                      type="number"
                      min={0}
                      max={100}
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(skill.id, 'proficiency', parseInt(e.target.value) || 0)}
                    />
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="grid gap-4 sm:grid-cols-[1fr,auto,auto] border-t border-border pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-skill-name">New Skill</Label>
                <Input 
                  id="new-skill-name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Add a new skill"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-skill-proficiency">Proficiency %</Label>
                <Input 
                  id="new-skill-proficiency"
                  type="number"
                  min={0}
                  max={100}
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={addSkill}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
