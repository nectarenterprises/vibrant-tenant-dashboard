
import { supabase } from '@/integrations/supabase/client';

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
