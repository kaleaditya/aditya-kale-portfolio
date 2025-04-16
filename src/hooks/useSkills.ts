
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
      
      // Use type assertion to work around TypeScript errors
      const { data, error } = await supabase
        .from('skills' as any)
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Type assertion to ensure the data is treated as Skill[]
      setSkills(data as unknown as Skill[]);
      return data as unknown as Skill[];
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
      
      // Use type assertion to work around TypeScript errors
      const { data, error } = await supabase
        .from('skills' as any)
        .insert([skill as any])
        .select();
      
      if (error) throw error;
      
      // Type assertion to ensure the data is treated as Skill
      const newSkill = data?.[0] as unknown as Skill;
      setSkills(prev => [...prev, newSkill]);
      toast({
        title: 'Success',
        description: 'Skill added successfully',
      });
      
      return newSkill;
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
      
      // Use type assertion to work around TypeScript errors
      const { data, error } = await supabase
        .from('skills' as any)
        .update(updates as any)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Type assertion to ensure the data is treated as Skill
      const updatedSkill = data?.[0] as unknown as Skill;
      setSkills(prev => prev.map(s => s.id === id ? updatedSkill : s));
      toast({
        title: 'Success',
        description: 'Skill updated successfully',
      });
      
      return updatedSkill;
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
      
      // Use type assertion to work around TypeScript errors
      const { error } = await supabase
        .from('skills' as any)
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
        // Use type assertion to work around TypeScript errors
        const { error } = await supabase
          .from('skills' as any)
          .update({ display_order: skill.display_order } as any)
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
