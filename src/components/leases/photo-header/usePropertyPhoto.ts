import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

interface UsePropertyPhotoProps {
  propertyId: string | undefined;
}

export const usePropertyPhoto = ({ propertyId }: UsePropertyPhotoProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
      toast({
        title: "Photo uploaded",
        description: "The property photo has been uploaded successfully."
      });
    },
    onError: (error) => {
      console.error('Photo upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the property photo."
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  // Update the uploadDocument call to match the correct signature
  const uploadPhoto = async (file: File) => {
    if (!propertyId) return null;
    
    try {
      setIsUploading(true);
      
      // Use the updated uploadDocument function with correct parameters
      const result = await uploadDocument(
        propertyId,
        file,
        "Property Photo",
        "photo",
        "Main property photo"
      );
      
      if (!result) {
        throw new Error('Failed to upload property photo');
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading property photo:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the property photo."
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadPhoto,
    uploadMutation
  };
};
