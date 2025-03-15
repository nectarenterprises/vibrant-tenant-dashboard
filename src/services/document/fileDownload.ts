
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument } from '@/types/property';
import { updateDocumentAccessTimestamp } from './metadata';

/**
 * Get a download URL for a file in Supabase storage
 * @param path Path to the file
 * @returns Download URL or error
 */
export const getFileDownloadUrl = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 60); // URL valid for 60 seconds

    if (error) {
      throw error;
    }

    return data?.signedUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

/**
 * Download a file from Supabase storage
 * @param path Path to the file
 * @param filename Filename to save as
 * @returns Download result or error
 */
export const downloadFile = async (path: string, filename: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);

    if (error) {
      throw error;
    }

    // Create a download link
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Download a document and update access timestamp
 */
export const downloadDocument = async (document: PropertyDocument) => {
  try {
    // First update the access timestamp
    await updateDocumentAccessTimestamp(document.id);
    
    // Then download the file
    return await downloadFile(document.filePath, document.name);
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

/**
 * Export compatibility aliases
 */
export { downloadFile, getFileDownloadUrl, downloadDocument };
