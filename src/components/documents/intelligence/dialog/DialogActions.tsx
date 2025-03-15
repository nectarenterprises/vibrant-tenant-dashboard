
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FolderType } from '@/services/document/types';

interface DialogActionsProps {
  isUploading: boolean;
  file: File | null;
  name: string;
  existingDocument: { id: string } | null | undefined;
  onClose: () => void;
  onUpload: () => Promise<void>;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  isUploading,
  file,
  name,
  existingDocument,
  onClose,
  onUpload
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isUploading}>
        Cancel
      </Button>
      <Button 
        onClick={onUpload}
        disabled={isUploading || !file || (!existingDocument && !name)}
      >
        {isUploading ? 'Uploading...' : existingDocument ? 'Upload New Version' : 'Upload Document'}
      </Button>
    </DialogFooter>
  );
};

export default DialogActions;
