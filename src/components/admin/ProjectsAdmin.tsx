
import React, { useState, useEffect } from 'react';
import { Pencil, Trash, Plus, Image, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProjects, Project } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';

const ProjectsAdmin = () => {
  const { projects, loading, error, fetchProjects, addProject, updateProject, deleteProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open form to create new project
  const handleNewProject = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '',
    });
    setCurrentProject(null);
    setIsDialogOpen(true);
  };

  // Open form to edit existing project
  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      tags: project.tags,
      link: project.link || '',
    });
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  // Open confirmation dialog to delete project
  const handleDeleteClick = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion of project
  const handleDeleteProject = async () => {
    if (currentProject) {
      const success = await deleteProject(currentProject.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setCurrentProject(null);
      }
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value,
    }));
  };

  // Save project (create new or update existing)
  const handleSaveProject = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (currentProject) {
        // Update existing project
        await updateProject(currentProject.id, formData);
      } else {
        // Create new project
        await addProject(formData as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleNewProject} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Project</span>
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          <p>Error loading projects: {error}</p>
          <Button variant="outline" onClick={fetchProjects} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No projects found. Click "Add Project" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditProject(project)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(project)}
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

      {/* Project Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Project title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Project description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="image" 
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button variant="outline" className="shrink-0">
                  <Image size={16} className="mr-2" />
                  Browse
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={handleChange}
                placeholder="React, Tailwind, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Project Link</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="link" 
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="flex-1"
                />
                {formData.link && (
                  <a 
                    href={formData.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    <Link size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentProject ? 'Update Project' : 'Add Project'}
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
            Are you sure you want to delete the project "{currentProject?.title}"? 
            This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProject}
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

export default ProjectsAdmin;
