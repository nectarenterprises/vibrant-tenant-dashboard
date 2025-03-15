
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Update file metadata in Supabase storage
 * @param fileId ID of the file to update
 * @param metadata Updated metadata
 * @returns Update result with data or error
 */
export const updateFileMetadata = async (fileId: string, metadata: any) => {
  try {
    // Use the appropriate table name that exists in the database
    // Instead of "documents", use "property_documents" or another valid table
    const { data, error } = await supabase
      .from('property_documents')
      .update(metadata)
      .eq('id', fileId);

    if (error) {
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Error updating file metadata:', error);
    throw error;
  }
};

/**
 * Replace a file in Supabase storage
 * @param path Path of the file to replace
 * @param file New file to upload
 * @returns Upload result with data or error
 */
export const replaceFile = async (path: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    return { data, filePath };
  } catch (error) {
    console.error('Error replacing file:', error);
    throw error;
  }
};
