
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

export interface UsePropertyPhotoProps {
  propertyId: string | undefined;
}

export const usePropertyPhoto = ({ propertyId }: UsePropertyPhotoProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  
  // Define upload function that will be used by the mutation
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
  
  const uploadMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
      toast({
        title: "Photo uploaded",
        description: "The property photo has been uploaded successfully."
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
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

  const handleUpload = async () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return {
    isUploading,
    setIsUploading,
    uploadDialogOpen,
    setUploadDialogOpen,
    selectedFile,
    setSelectedFile,
    uploadPhoto,
    uploadMutation,
    handleUpload,
    photoUrl,
    setPhotoUrl,
    isLoading,
    setIsLoading
  };
};
