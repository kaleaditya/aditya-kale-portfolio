
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AboutData {
  id: string;
  title: string;
  subtitle: string;
  bio: string;
  education: string;
  experience_years: number;
  awards: string | null;
  project_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAbout = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      
      setAboutData(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load about data: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load about data: ${err.message}`,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAbout = async (about: Omit<AboutData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('about')
        .insert([about])
        .select();
      
      if (error) throw error;
      
      setAboutData(data[0]);
      toast({
        title: 'Success',
        description: 'About data created successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error creating about data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to create about data: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAbout = async (id: string, updates: Partial<Omit<AboutData, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('about')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (aboutData && aboutData.id === id) {
        setAboutData(data[0]);
      }
      
      toast({
        title: 'Success',
        description: 'About data updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating about data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update about data: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setAboutActive = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, set all about to inactive
      await supabase
        .from('about')
        .update({ is_active: false })
        .neq('id', id);
      
      // Then set the selected one to active
      const { data, error } = await supabase
        .from('about')
        .update({ is_active: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setAboutData(data[0]);
      toast({
        title: 'Success',
        description: 'About data set as active successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error setting about as active:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to set about as active: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    aboutData,
    loading,
    error,
    fetchActiveAbout,
    fetchAllAbout,
    createAbout,
    updateAbout,
    setAboutActive
  };
};
