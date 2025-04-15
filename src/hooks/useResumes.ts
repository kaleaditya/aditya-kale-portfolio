
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Resume {
  id: string;
  file_name: string;
  file_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setResumes(data || []);
    } catch (err: any) {
      console.error('Error fetching resumes:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load resumes: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      // Upload file to storage
      const filePath = `${Date.now()}_${file.name}`;
      
      // Track upload progress manually
      const progressHandler = (progress: number) => {
        setUploadProgress(Math.round(progress * 100));
      };
      
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 0.1;
        if (progress < 0.95) {
          progressHandler(progress);
        }
      }, 100);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100); // Set to 100% when upload is complete
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file');
      }
      
      // Create database entry
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .insert([{
          file_name: file.name,
          file_path: urlData.publicUrl,
          is_active: false // Default to inactive, user can activate it later
        }])
        .select();
      
      if (resumeError) throw resumeError;
      
      setResumes(prev => [...prev, resumeData[0]]);
      toast({
        title: 'Success',
        description: 'Resume uploaded successfully',
      });
      
      return resumeData[0];
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to upload resume: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const setActiveResume = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, set all resumes to inactive
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .not('id', 'eq', id); // Update all except the one we're making active
      
      // Then, set the selected resume to active
      const { data, error } = await supabase
        .from('resumes')
        .update({ is_active: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Update local state
      await fetchResumes();
      
      toast({
        title: 'Success',
        description: 'Active resume updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error setting active resume:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to set active resume: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string, filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract the filename from the file path URL
      const url = new URL(filePath);
      const pathnameParts = url.pathname.split('/');
      const filename = pathnameParts[pathnameParts.length - 1];
      
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([filename]);
      
      if (storageError) {
        console.warn('Error removing file from storage:', storageError);
        // Continue anyway to delete the database record
      }
      
      // Delete record from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      setResumes(prev => prev.filter(r => r.id !== id));
      toast({
        title: 'Success',
        description: 'Resume deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete resume: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resumes,
    loading,
    error,
    uploadProgress,
    fetchResumes,
    uploadResume,
    setActiveResume,
    deleteResume
  };
};
