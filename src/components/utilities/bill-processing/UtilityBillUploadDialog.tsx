
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UtilityBillUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

const UtilityBillUploadDialog: React.FC<UtilityBillUploadDialogProps> = ({
  isOpen,
  onClose,
  propertyId
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Utility Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            Please select a utility bill to upload. The system will attempt to extract data automatically.
          </p>
          <div className="flex justify-center">
            <Button onClick={onClose}>Upload Bill</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UtilityBillUploadDialog;
