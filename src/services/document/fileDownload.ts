
import { supabase } from '@/integrations/supabase/client';

/**
 * Download a file from Supabase storage
 * @param path Path of the file to download
 * @returns Download result with data or error
 */
export const downloadFile = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);

    if (error) {
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Get a signed URL for a file in Supabase storage
 * @param path Path of the file
 * @param expiresIn Expiration time in seconds (default: 60)
 * @returns Signed URL for the file
 */
export const getFileDownloadUrl = async (path: string, expiresIn: number = 60) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};
