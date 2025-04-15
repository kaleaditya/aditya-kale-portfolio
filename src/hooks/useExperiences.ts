
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  technologies: string[];
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      setExperiences(data || []);
    } catch (err: any) {
      console.error('Error fetching experiences:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load experiences: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('experiences')
        .insert([experience])
        .select();
      
      if (error) throw error;
      
      setExperiences(prev => [...prev, data[0]]);
      toast({
        title: 'Success',
        description: 'Experience added successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error adding experience:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to add experience: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExperience = async (id: string, updates: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setExperiences(prev => prev.map(e => e.id === id ? data[0] : e));
      toast({
        title: 'Success',
        description: 'Experience updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating experience:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update experience: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast({
        title: 'Success',
        description: 'Experience deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting experience:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete experience: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    experiences,
    loading,
    error,
    fetchExperiences,
    addExperience,
    updateExperience,
    deleteExperience
  };
};
