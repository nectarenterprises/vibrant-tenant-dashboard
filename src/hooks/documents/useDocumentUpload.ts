
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { FolderType } from '@/services/document/types';

/**
 * Hook for managing document upload state and functionality
 */
export const useDocumentUpload = () => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<FolderType>('lease');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Reset form values
  const resetUploadForm = () => {
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
    setDocumentType('lease');
    setUploadDialogOpen(false);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  // Validate and prepare upload data
  const prepareUpload = () => {
    if (!fileUpload) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return null;
    }
    
    return {
      file: fileUpload,
      name: documentName,
      description: documentDescription,
      documentType
    };
  };

  return {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  };
};
