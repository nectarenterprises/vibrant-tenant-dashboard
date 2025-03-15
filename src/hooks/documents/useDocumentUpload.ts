
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { DocumentType } from '@/types/property';

/**
 * Hook for managing document upload state and functionality
 */
export const useDocumentUpload = () => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('lease');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [additionalMetadata, setAdditionalMetadata] = useState<Record<string, any>>({});

  // Reset form values
  const resetUploadForm = () => {
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
    setDocumentType('lease');
    setUploadDialogOpen(false);
    setIsUploading(false);
    setAdditionalMetadata({});
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
    
    if (!documentName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing document name",
        description: "Please enter a name for the document.",
      });
      return null;
    }
    
    return {
      file: fileUpload,
      name: documentName,
      description: documentDescription,
      documentType,
      metadata: additionalMetadata
    };
  };

  return {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    isUploading,
    additionalMetadata,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    setIsUploading,
    setAdditionalMetadata,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  };
};
