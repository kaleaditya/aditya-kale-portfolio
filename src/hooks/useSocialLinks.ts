
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setSocialLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching social links:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load social links: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = async (link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('social_links')
        .insert([link])
        .select();
      
      if (error) throw error;
      
      setSocialLinks(prev => [...prev, data[0]]);
      toast({
        title: 'Success',
        description: 'Social link added successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error adding social link:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to add social link: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setSocialLinks(prev => prev.map(link => link.id === id ? data[0] : link));
      toast({
        title: 'Success',
        description: 'Social link updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating social link:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update social link: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSocialLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: 'Success',
        description: 'Social link deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting social link:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete social link: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLinkOrder = async (links: { id: string, display_order: number }[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update each link's display_order in database
      for (const link of links) {
        const { error } = await supabase
          .from('social_links')
          .update({ display_order: link.display_order })
          .eq('id', link.id);
        
        if (error) throw error;
      }
      
      // Refetch to ensure we have the latest data
      await fetchSocialLinks();
      
      toast({
        title: 'Success',
        description: 'Social link order updated successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating social link order:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update social link order: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    socialLinks,
    loading,
    error,
    fetchSocialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    updateSocialLinkOrder
  };
};
