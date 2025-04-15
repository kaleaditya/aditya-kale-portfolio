
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Save, CalendarRange, Loader2 } from 'lucide-react';
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
import { useExperiences, Experience } from '@/hooks/useExperiences';

const ExperiencesAdmin = () => {
  const { experiences, loading, error, fetchExperiences, addExperience, updateExperience, deleteExperience } = useExperiences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    technologies: []
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleNewExperience = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      technologies: []
    });
    setCurrentExperience(null);
    setIsDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.end_date,
      is_current: experience.is_current,
      technologies: experience.technologies
    });
    setCurrentExperience(experience);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteExperience = async () => {
    if (currentExperience) {
      const success = await deleteExperience(currentExperience.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setCurrentExperience(null);
      }
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
      is_current: checked,
      end_date: checked ? '' : prev.end_date
    }));
  };

  const handleSaveExperience = async () => {
    if (!formData.company || !formData.position || !formData.start_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (currentExperience) {
        await updateExperience(currentExperience.id, formData);
      } else {
        await addExperience(formData as Omit<Experience, 'id' | 'created_at' | 'updated_at'>);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving experience:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Experience</h1>
        <div className="flex gap-2">
          <Button onClick={fetchExperiences} className="flex items-center gap-2" variant="outline">
            <Save size={16} />
            <span>Refresh</span>
          </Button>
          <Button onClick={handleNewExperience} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Experience</span>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          <p>Error loading experiences: {error}</p>
          <Button variant="outline" onClick={fetchExperiences} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
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
              {experiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No experiences found. Click "Add Experience" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                experiences.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">{experience.position}</TableCell>
                    <TableCell>{experience.company}</TableCell>
                    <TableCell>
                      {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date || '')}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Experience Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Position Title</Label>
              <Input 
                id="position" 
                name="position"
                value={formData.position || ''}
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
                <Label htmlFor="start_date">Start Date</Label>
                <Input 
                  id="start_date" 
                  name="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="end_date">End Date</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is_current" className="text-sm text-muted-foreground">
                      Current
                    </Label>
                    <Switch 
                      id="is_current"
                      checked={formData.is_current || false}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </div>
                <Input 
                  id="end_date" 
                  name="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  disabled={formData.is_current}
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
            <Button onClick={handleSaveExperience} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentExperience ? 'Update Experience' : 'Add Experience'}
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
            Are you sure you want to delete the experience "{currentExperience?.position}" at "{currentExperience?.company}"? 
            This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteExperience}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperiencesAdmin;
