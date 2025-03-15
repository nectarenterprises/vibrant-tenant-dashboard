
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the public URL for a property image
 */
export const getPropertyImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from('property-files')
    .getPublicUrl(imagePath);
    
  return data.publicUrl;
};

/**
 * Uploads a property image to Supabase Storage
 */
export const uploadPropertyImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('property-files')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Image upload failed",
        description: error.message,
      });
      return null;
    }
    
    return filePath;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Image upload failed",
      description: error.message || "An error occurred during upload",
    });
    return null;
  }
};

/**
 * Updates the property with the new image path
 */
export const updatePropertyImage = async (propertyId: string, imagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ image_path: imagePath })
      .eq('id', propertyId);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update property",
        description: error.message,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Update failed",
      description: error.message || "An error occurred during the update",
    });
    return false;
  }
};
