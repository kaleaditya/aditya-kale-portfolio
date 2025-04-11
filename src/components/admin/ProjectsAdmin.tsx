
import React, { useState } from 'react';
import { Pencil, Trash, Plus, Image, Link } from 'lucide-react';
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

// Sample project type
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

// Mock data
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A fully-featured e-commerce platform built with React and Node.js',
    image: '/placeholder.svg',
    tags: ['React', 'Node.js', 'MongoDB'],
    link: 'https://example.com/project1',
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Personal portfolio website showcasing projects and skills',
    image: '/placeholder.svg',
    tags: ['React', 'Tailwind CSS', 'Vite'],
    link: 'https://example.com/project2',
  },
];

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
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
      image: project.image,
      tags: project.tags,
      link: project.link,
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
  const handleDeleteProject = () => {
    if (currentProject) {
      setProjects(projects.filter(p => p.id !== currentProject.id));
      setIsDeleteDialogOpen(false);
      setCurrentProject(null);
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
  const handleSaveProject = () => {
    if (currentProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === currentProject.id ? { ...p, ...formData } : p
      ));
    } else {
      // Create new project
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled Project',
        description: formData.description || '',
        image: formData.image || '/placeholder.svg',
        tags: formData.tags || [],
        link: formData.link || '',
      };
      setProjects([...projects, newProject]);
    }
    setIsDialogOpen(false);
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
            {projects.map((project) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

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
                  placeholder="/placeholder.svg"
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
            <Button onClick={handleSaveProject}>
              {currentProject ? 'Update Project' : 'Add Project'}
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsAdmin;
