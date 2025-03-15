
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FolderType } from '@/services/document/types';

// Import the refactored components
import FileSelectField from './upload/FileSelectField';
import DocumentTypeField from './upload/DocumentTypeField';
import DocumentNameField from './upload/DocumentNameField';
import DocumentDescriptionField from './upload/DocumentDescriptionField';
import DocumentTypeFields from './upload/DocumentTypeFields';
import UploadDialogFooter from './upload/DialogFooter';

interface UploadDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fileUpload: File | null;
  documentName: string;
  documentDescription: string;
  documentType: FolderType;
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onTypeChange: (type: FolderType) => void;
  onUpload: () => void;
  additionalMetadata?: Record<string, any>;
  onAdditionalMetadataChange?: (metadata: Record<string, any>) => void;
}

const UploadDialog = ({
  isOpen,
  setIsOpen,
  fileUpload,
  documentName,
  documentDescription,
  documentType,
  isUploading,
  onFileSelect,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onUpload,
  additionalMetadata = {},
  onAdditionalMetadataChange = () => {}
}: UploadDialogProps) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(additionalMetadata);

  // Update parent component when form values change
  useEffect(() => {
    if (onAdditionalMetadataChange) {
      onAdditionalMetadataChange(formValues);
    }
  }, [formValues, onAdditionalMetadataChange]);

  // Reset form values when document type changes
  useEffect(() => {
    setFormValues({});
  }, [documentType]);

  const handleClose = () => {
    if (!isUploading) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the selected folder
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FileSelectField 
            fileUpload={fileUpload}
            onFileSelect={onFileSelect}
          />
          
          <DocumentTypeField 
            documentType={documentType}
            onTypeChange={onTypeChange}
          />
          
          <DocumentNameField 
            documentName={documentName}
            onNameChange={onNameChange}
          />
          
          <DocumentDescriptionField 
            documentDescription={documentDescription}
            onDescriptionChange={onDescriptionChange}
          />
          
          {/* Render dynamic fields based on document type */}
          <DocumentTypeFields 
            documentType={documentType}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        </div>
        
        <UploadDialogFooter 
          isUploading={isUploading}
          fileUpload={fileUpload}
          onUpload={onUpload}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
