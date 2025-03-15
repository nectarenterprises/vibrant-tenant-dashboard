
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
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  propertyId: string;
  onDocumentUploaded?: () => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFile,
  setSelectedFile,
  documentType,
  setDocumentType,
  documentName,
  setDocumentName,
  propertyId,
  onDocumentUploaded
}) => {
  const [documentDescription, setDocumentDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || !documentName || !documentType) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please complete all required fields."
      });
      return;
    }

    setIsUploading(true);

    try {
      await uploadDocument(
        propertyId,
        selectedFile,
        documentName,
        documentType,
        documentDescription
      );

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully."
      });

      // Reset form
      setSelectedFile(null);
      setDocumentName('');
      setDocumentDescription('');
      setDocumentType('lease' as DocumentType);

      // Close dialog
      onOpenChange(false);

      // Callback
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your document."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FileUploadArea
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setDocumentName={setDocumentName}
          />

          <DocumentTypeSelector
            documentType={documentType}
            setDocumentType={setDocumentType}
          />

          <DocumentNameField
            documentName={documentName}
            setDocumentName={setDocumentName}
          />

          <DocumentDescriptionField
            documentDescription={documentDescription}
            setDocumentDescription={setDocumentDescription}
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
