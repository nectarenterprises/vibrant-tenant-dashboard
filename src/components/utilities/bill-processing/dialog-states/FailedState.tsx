
import React from 'react';
import { Button } from '@/components/ui/button';

interface FailedStateProps {
  onClose: () => void;
  onReset: () => void;
}

const FailedState: React.FC<FailedStateProps> = ({
  onClose,
  onReset
}) => {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-destructive">Processing Failed</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There was an error processing your utility bill.
        </p>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onReset}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default FailedState;
