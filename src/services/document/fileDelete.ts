
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a file from Supabase storage
 * @param path Path of the file to delete
 * @returns Delete result with success or error
 */
export const deleteFile = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Delete a document from database and storage
 * @param documentId ID of the document to delete
 * @param filePath Path of the file to delete
 * @returns Delete result with success or error
 */
export const deleteDocument = async (documentId: string, filePath: string) => {
  if (!documentId) {
    throw new Error('Document ID is required');
  }
  
  try {
    // Delete metadata from database first
    const { error: dbError } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      throw dbError;
    }
    
    // Delete file from storage
    if (filePath) {
      await deleteFile(filePath);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
