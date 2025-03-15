
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload a file to Supabase storage
 * @param file File to upload
 * @param path Path in storage where the file will be saved
 * @returns Upload result with data or error
 */
export const uploadFile = async (file: File, path: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return { data, filePath };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase storage
 * @param path Path of the file to delete
 * @returns Delete result with data or error
 */
export const deleteFile = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) {
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get a public URL for a file in Supabase storage
 * @param path Path of the file
 * @returns Public URL of the file
 */
export const getFileUrl = (path: string) => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Get a signed URL for a file in Supabase storage (time-limited access)
 * @param path Path of the file
 * @param expiresIn Expiration time in seconds (default: 60)
 * @returns Signed URL for the file
 */
export const getSignedUrl = async (path: string, expiresIn: number = 60) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};
