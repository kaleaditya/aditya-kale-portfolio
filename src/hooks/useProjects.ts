
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  link: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load projects: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();
      
      if (error) throw error;
      
      setProjects(prev => [...prev, data[0]]);
      toast({
        title: 'Success',
        description: 'Project added successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error adding project:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to add project: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === id ? data[0] : p));
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update project: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete project: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
};
