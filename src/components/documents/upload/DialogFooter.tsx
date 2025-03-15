
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FileUp } from 'lucide-react';

interface UploadDialogFooterProps {
  isUploading: boolean;
  fileUpload: File | null;
  onUpload: () => void;
  onClose: () => void;
}

const UploadDialogFooter: React.FC<UploadDialogFooterProps> = ({
  isUploading,
  fileUpload,
  onUpload,
  onClose
}) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={onClose} 
        disabled={isUploading}
      >
        Cancel
      </Button>
      <Button 
        onClick={onUpload}
        disabled={!fileUpload || isUploading}
      >
        {isUploading ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
            Uploading...
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </>
        )}
      </Button>
    </DialogFooter>
  );
};

export default UploadDialogFooter;
