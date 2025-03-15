
import { useState } from 'react';
import { uploadPropertyDocument } from '@/services/document';
import { uploadPropertyImage, updatePropertyImage } from '@/services/property/PropertyImageService';
import { toast } from '@/components/ui/use-toast';
import { DocumentType } from '@/types/property';

export const usePropertyPhoto = (
  propertyId: string,
  propertyName: string,
  onPhotoUpdated: () => void
) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to upload."
      });
      return;
    }

    setIsUploading(true);

    try {
      const imagePath = await uploadPropertyImage(selectedFile);
      
      if (!imagePath) {
        throw new Error("Failed to upload image");
      }

      const updated = await updatePropertyImage(propertyId, imagePath);
      
      if (!updated) {
        throw new Error("Failed to update property record");
      }

      await uploadPropertyDocument(
        propertyId,
        selectedFile,
        'photo' as DocumentType,
        `Property Photo - ${new Date().toLocaleDateString()}`,
        `Property photo for ${propertyName}`
      );
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your property photo has been updated."
      });
      
      setUploadDialogOpen(false);
      setSelectedFile(null);
      onPhotoUpdated();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your photo."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDialogOpen,
    setUploadDialogOpen,
    selectedFile,
    setSelectedFile,
    isUploading,
    handleUpload
  };
};
