
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DocumentType } from '@/types/property';

interface DocumentDialogFooterProps {
  isUploading: boolean;
  selectedFile: File | null;
  documentName: string;
  documentType: DocumentType;
  handleCancel: () => void;
  handleUpload: () => void;
}

const DocumentDialogFooter: React.FC<DocumentDialogFooterProps> = ({
  isUploading,
  selectedFile,
  documentName,
  documentType,
  handleCancel,
  handleUpload
}) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={handleCancel}
        disabled={isUploading}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleUpload}
        disabled={isUploading || !selectedFile || !documentName || !documentType}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </DialogFooter>
  );
};

export default DocumentDialogFooter;
