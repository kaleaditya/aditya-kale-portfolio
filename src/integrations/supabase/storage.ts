
import { supabase } from './client';

// Initialize storage buckets if they don't exist
export const initializeStorage = async () => {
  try {
    // Check if buckets exist
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Check for 'images' bucket
    const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
    if (!imagesBucketExists) {
      // Create images bucket
      await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB file size limit
      });
      console.log('Created images bucket');
    }
    
    // Check for 'resumes' bucket
    const resumesBucketExists = buckets?.some(bucket => bucket.name === 'resumes');
    if (!resumesBucketExists) {
      // Create resumes bucket
      await supabase.storage.createBucket('resumes', {
        public: true,
        fileSizeLimit: 10485760, // 10MB file size limit
      });
      console.log('Created resumes bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};
