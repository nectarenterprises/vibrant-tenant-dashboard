
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyDocument } from '@/services/FileStorageService';

// Import the refactored components
import DocumentTypeSelector from './document/DocumentTypeSelector';
import DocumentNameField from './document/DocumentNameField';
import DocumentDescriptionField from './document/DocumentDescriptionField';
import FileUploadArea from './document/FileUploadArea';
import DocumentDialogFooter from './document/DocumentDialogFooter';

interface DocumentDialogProps {
  showDocumentDialog: boolean;
  setShowDocumentDialog: (show: boolean) => void;
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
  showDocumentDialog,
  setShowDocumentDialog,
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
  
  const handleDocumentUpload = async () => {
    if (!selectedFile || !documentName || !documentType || !propertyId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadPropertyDocument(
        propertyId,
        selectedFile,
        documentType,
        documentName,
        documentDescription
      );

      if (result) {
        toast({
          title: "Document uploaded",
          description: `${documentName} has been uploaded successfully.`,
        });
        
        handleCancel();
        
        // Trigger callback to refresh documents list
        if (onDocumentUploaded) {
          onDocumentUploaded();
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your document.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setShowDocumentDialog(false);
    setSelectedFile(null);
    setDocumentName('');
    setDocumentDescription('');
  };

  return (
    <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document related to this property lease.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
          
          <FileUploadArea 
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setDocumentName={setDocumentName}
          />
        </div>
        
        <DocumentDialogFooter 
          isUploading={isUploading}
          selectedFile={selectedFile}
          documentName={documentName}
          documentType={documentType}
          handleDocumentUpload={handleDocumentUpload}
          handleCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
