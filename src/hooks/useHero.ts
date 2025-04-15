
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Hero {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background_image: string | null;
  profile_image: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHero = () => {
  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchActiveHero = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No active hero found
          setHeroData(null);
        } else {
          throw error;
        }
      } else {
        setHeroData(data as Hero);
      }
      
      return data as Hero;
    } catch (err: any) {
      console.error('Error fetching active hero:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load hero data: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setHeroes(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching heroes:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load hero data: ${err.message}`,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createHero = async (hero: Omit<Hero, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // If setting this hero as active, deactivate all other heroes first
      if (hero.is_active) {
        await supabase
          .from('hero')
          .update({ is_active: false })
          .not('id', 'is', null);
      }
      
      const { data, error } = await supabase
        .from('hero')
        .insert([hero])
        .select();
      
      if (error) throw error;
      
      await fetchAllHeroes();
      
      toast({
        title: 'Success',
        description: 'Hero created successfully',
      });
      
      return data[0] as Hero;
    } catch (err: any) {
      console.error('Error creating hero:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to create hero: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateHero = async (id: string, updates: Partial<Omit<Hero, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      // If setting this hero as active, deactivate all other heroes first
      if (updates.is_active) {
        await supabase
          .from('hero')
          .update({ is_active: false })
          .not('id', 'eq', id);
      }
      
      const { data, error } = await supabase
        .from('hero')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (heroData && heroData.id === id) {
        setHeroData({...heroData, ...updates} as Hero);
      }
      
      await fetchAllHeroes();
      
      toast({
        title: 'Success',
        description: 'Hero updated successfully',
      });
      
      return data[0] as Hero;
    } catch (err: any) {
      console.error('Error updating hero:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update hero: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteHero = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('hero')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (heroData && heroData.id === id) {
        setHeroData(null);
      }
      
      await fetchAllHeroes();
      
      toast({
        title: 'Success',
        description: 'Hero deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting hero:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete hero: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, type: 'background' | 'profile') => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      // Upload file to storage
      const fileName = `hero_${type}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Track upload progress manually
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 0.1;
        if (progress < 0.95) {
          setUploadProgress(Math.round(progress * 100));
        }
      }, 100);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded image');
      }
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
      
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to upload image: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return {
    heroData,
    heroes,
    loading,
    error,
    uploadProgress,
    fetchActiveHero,
    fetchAllHeroes,
    createHero,
    updateHero,
    deleteHero,
    uploadImage
  };
};
