
// Import necessary dependencies
import { supabase } from '@/integrations/supabase/client';

/**
 * Get a download URL for a file from Supabase storage
 * @param filePath Path to the file in Supabase storage
 * @returns The download URL or null if an error occurs
 */
export const getFileDownloadUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60);
    
    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    return null;
  }
};

/**
 * Download a file from Supabase storage
 * @param filePath Path to the file in Supabase storage
 * @param fileName Name to save the file as
 * @returns Success status
 */
export const downloadFile = async (filePath: string, fileName: string): Promise<boolean> => {
  try {
    const url = await getFileDownloadUrl(filePath);
    
    if (!url) {
      throw new Error('Failed to generate download URL');
    }
    
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Create a temporary anchor element to trigger download
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

/**
 * Download a document (convenience function)
 * @param filePath Path to the document in storage
 * @param fileName Name to save the document as
 * @returns Success status
 */
export const downloadDocument = async (filePath: string, fileName: string): Promise<boolean> => {
  return downloadFile(filePath, fileName);
};
