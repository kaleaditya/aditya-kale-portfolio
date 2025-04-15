
import { supabase } from './client';

// Initialize storage buckets if they don't exist
export const initializeStorage = async () => {
  try {
    // Check if 'images' bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
    
    if (!imagesBucketExists) {
      // Create images bucket
      await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB file size limit
      });
      console.log('Created images bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};
