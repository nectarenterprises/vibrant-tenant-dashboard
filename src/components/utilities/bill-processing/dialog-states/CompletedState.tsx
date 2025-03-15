
import React from 'react';
import { Button } from '@/components/ui/button';

interface CompletedStateProps {
  onClose: () => void;
}

const CompletedState: React.FC<CompletedStateProps> = ({
  onClose
}) => {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-tenant-green">Processing Complete!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your utility bill has been processed and saved successfully.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default CompletedState;
