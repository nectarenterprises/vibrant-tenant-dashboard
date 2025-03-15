
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentType } from '@/types/property';
import DocumentTypeSelector from './document/DocumentTypeSelector';
import DocumentNameField from './document/DocumentNameField';
import DocumentDescriptionField from './document/DocumentDescriptionField';
import FileUploadArea from './document/FileUploadArea';
import DocumentDialogFooter from './document/DocumentDialogFooter';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

export interface DocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  onDocumentUploaded: () => void;
  initialDocumentType?: DocumentType;
  initialFile?: File | null;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  propertyId,
  onDocumentUploaded,
  initialDocumentType,
  initialFile
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile || null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(initialDocumentType || 'other');

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentName('');
    setDocumentDescription('');
    setDocumentType(initialDocumentType || 'other');
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const uploadDisabled = !selectedFile || !documentName || !documentType;

  const handleDocumentNameChange = (value: string) => {
    setDocumentName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDocumentDescription(value);
  };

  const handleTypeChange = (value: DocumentType) => {
    setDocumentType(value);
  };

  const handleUpload = async () => {
    if (uploadDisabled) return;

    try {
      setIsUploading(true);

      if (!selectedFile || !propertyId) {
        throw new Error('Missing required upload information');
      }

      await uploadDocument({
        file: selectedFile,
        propertyId,
        name: documentName,
        type: documentType,
        description: documentDescription
      });

      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully.',
      });

      resetForm();
      onDocumentUploaded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your document. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FileUploadArea
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setDocumentName={setDocumentName}
          />

          <DocumentNameField
            documentName={documentName}
            setDocumentName={handleDocumentNameChange}
          />

          <DocumentDescriptionField
            documentDescription={documentDescription}
            setDocumentDescription={handleDescriptionChange}
          />

          <DocumentTypeSelector
            documentType={documentType}
            setDocumentType={handleTypeChange}
          />
        </div>

        <DocumentDialogFooter
          isUploading={isUploading}
          selectedFile={selectedFile}
          documentName={documentName}
          documentType={documentType}
          handleCancel={handleCancel}
          handleUpload={handleUpload}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
