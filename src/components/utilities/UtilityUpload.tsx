
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { FolderType } from '@/services/document/types';
import { Property } from '@/types/property';
import UploadDialog from '@/components/documents/UploadDialog';

interface UtilityUploadProps {
  selectedProperty: Property | null;
  onUploadComplete: () => void;
}

const UtilityUpload: React.FC<UtilityUploadProps> = ({ 
  selectedProperty,
  onUploadComplete
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<FolderType>('utility');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileUpload || !selectedProperty) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a file to upload.",
      });
      return;
    }

    setUploadDialogOpen(false);
    toast({
      title: "Upload functionality",
      description: "Full upload functionality would be implemented here.",
    });
    
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
    onUploadComplete();
  };

  return (
    <UploadDialog
      isOpen={uploadDialogOpen}
      setIsOpen={setUploadDialogOpen}
      fileUpload={fileUpload}
      documentName={documentName}
      documentDescription={documentDescription}
      documentType={documentType}
      isUploading={false}
      onFileSelect={handleFileSelect}
      onNameChange={setDocumentName}
      onDescriptionChange={setDocumentDescription}
      onTypeChange={setDocumentType}
      onUpload={handleUpload}
    />
  );
};

export default UtilityUpload;
