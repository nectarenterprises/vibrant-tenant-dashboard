
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DocumentType } from '@/types/property';

interface DocumentDialogFooterProps {
  isUploading: boolean;
  uploadDisabled: boolean;
  handleCancel: () => void;
  handleUpload: () => void;
  selectedFile?: File | null;
  documentName?: string;
  documentType?: DocumentType;
}

const DocumentDialogFooter: React.FC<DocumentDialogFooterProps> = ({
  isUploading,
  uploadDisabled,
  handleCancel,
  handleUpload,
  selectedFile,
  documentName,
  documentType
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
        disabled={uploadDisabled || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </DialogFooter>
  );
};

export default DocumentDialogFooter;
