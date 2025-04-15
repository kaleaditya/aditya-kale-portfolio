
import React, { useState } from 'react';
import { Plus, Pencil, Trash, Save, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

// Sample experience type
interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  technologies: string[];
}

const ExperiencesAdmin = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      description: 'Led the development of multiple React-based applications with a focus on performance optimization and responsive design.',
      startDate: '2021-06',
      endDate: '',
      current: true,
      technologies: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Digital Creations',
      description: 'Collaborated with UX designers to implement modern user interfaces and interactive components for client websites.',
      startDate: '2019-03',
      endDate: '2021-05',
      current: false,
      technologies: ['JavaScript', 'React', 'SASS']
    },
    {
      id: '3',
      title: 'Web Developer Intern',
      company: 'StartUp Hub',
      description: 'Assisted in building responsive websites and implemented various frontend features using modern JavaScript frameworks.',
      startDate: '2018-06',
      endDate: '2019-02',
      current: false,
      technologies: ['HTML', 'CSS', 'JavaScript']
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    title: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: []
  });

  const handleNewExperience = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      technologies: []
    });
    setCurrentExperience(null);
    setIsDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setFormData({
      title: experience.title,
      company: experience.company,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      technologies: experience.technologies
    });
    setCurrentExperience(experience);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteExperience = () => {
    if (currentExperience) {
      setExperiences(experiences.filter(e => e.id !== currentExperience.id));
      toast({
        title: "Experience Deleted",
        description: `${currentExperience.title} at ${currentExperience.company} has been removed.`,
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      setCurrentExperience(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'technologies' ? value.split(',').map(tech => tech.trim()) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate
    }));
  };

  const handleSaveExperience = () => {
    if (!formData.title || !formData.company || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (currentExperience) {
      setExperiences(experiences.map(exp => 
        exp.id === currentExperience.id ? { ...exp, ...formData as Experience } : exp
      ));
      toast({
        title: "Experience Updated",
        description: `${formData.title} at ${formData.company} has been updated.`
      });
    } else {
      const newExperience: Experience = {
        id: Date.now().toString(),
        title: formData.title || '',
        company: formData.company || '',
        description: formData.description || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        current: formData.current || false,
        technologies: formData.technologies || []
      };
      setExperiences([...experiences, newExperience]);
      toast({
        title: "Experience Added",
        description: `${newExperience.title} at ${newExperience.company} has been added.`
      });
    }
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
  };

  const saveChanges = () => {
    console.log('Saving experiences:', experiences);
    toast({
      title: "Changes saved",
      description: "Your experience data has been updated successfully"
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Experience</h1>
        <div className="flex gap-2">
          <Button onClick={saveChanges} className="flex items-center gap-2">
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
          <Button onClick={handleNewExperience} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Experience</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">{experience.title}</TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>
                  {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditExperience(experience)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(experience)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Experience Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Position Title</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                placeholder="e.g., Tech Solutions Inc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe your responsibilities and achievements"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  name="startDate"
                  type="month"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="current" className="text-sm text-muted-foreground">
                      Current
                    </Label>
                    <Switch 
                      id="current"
                      checked={formData.current || false}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </div>
                <Input 
                  id="endDate" 
                  name="endDate"
                  type="month"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  disabled={formData.current}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input 
                id="technologies" 
                name="technologies"
                value={formData.technologies?.join(', ') || ''}
                onChange={handleChange}
                placeholder="React, TypeScript, Tailwind CSS, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExperience}>
              {currentExperience ? 'Update Experience' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p className="text-muted-foreground">
            Are you sure you want to delete the experience "{currentExperience?.title}" at "{currentExperience?.company}"? 
            This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteExperience}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperiencesAdmin;
