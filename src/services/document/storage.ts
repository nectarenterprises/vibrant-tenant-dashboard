
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Uploads a file to Supabase Storage
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<boolean> => {
  try {
    console.log(`Uploading file to bucket: ${bucketName}, path: ${filePath}`);
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
      return false;
    }
    
    console.log('File uploaded successfully');
    return true;
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: error.message || "An error occurred during upload",
    });
    return false;
  }
};

/**
 * Downloads a file from Supabase Storage
 */
export const downloadFile = async (
  bucketName: string,
  filePath: string
): Promise<void> => {
  try {
    console.log(`Downloading file from bucket: ${bucketName}, path: ${filePath}`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
      
    if (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message,
      });
      return;
    }
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'document';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your document is being downloaded.",
    });
  } catch (error: any) {
    console.error('Error in downloadFile:', error);
    toast({
      variant: "destructive",
      title: "Download failed",
      description: error.message || "An error occurred during download",
    });
  }
};

/**
 * Deletes a file from Supabase Storage
 */
export const deleteFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    console.log(`Deleting file from bucket: ${bucketName}, path: ${filePath}`);
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteFile:', error);
    toast({
      variant: "destructive",
        title: "Delete failed",
        description: error.message || "An error occurred while deleting the file",
    });
    return false;
  }
};

/**
 * Gets the public URL for a file
 */
export const getFilePublicUrl = (
  bucketName: string,
  filePath: string
): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
