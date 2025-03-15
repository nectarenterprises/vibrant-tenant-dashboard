
import React from 'react';
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
  onUpload
}: UploadDialogProps) => {
  const handleClose = () => {
    if (!isUploading) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
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
