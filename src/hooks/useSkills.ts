
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setSkills(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching skills:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load skills: ${err.message}`,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('skills')
        .insert([skill])
        .select();
      
      if (error) throw error;
      
      setSkills(prev => [...prev, data[0]]);
      toast({
        title: 'Success',
        description: 'Skill added successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error adding skill:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to add skill: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSkill = async (id: string, updates: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setSkills(prev => prev.map(s => s.id === id ? data[0] : s));
      toast({
        title: 'Success',
        description: 'Skill updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating skill:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update skill: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSkills(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Success',
        description: 'Skill deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete skill: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSkillOrder = async (skillsWithOrder: { id: string, display_order: number }[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update each skill's display_order in database
      for (const skill of skillsWithOrder) {
        const { error } = await supabase
          .from('skills')
          .update({ display_order: skill.display_order })
          .eq('id', skill.id);
        
        if (error) throw error;
      }
      
      // Refetch to ensure we have the latest data
      await fetchSkills();
      
      toast({
        title: 'Success',
        description: 'Skill order updated successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating skill order:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update skill order: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    loading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    updateSkillOrder
  };
};
