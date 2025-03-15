
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

interface FailedStateProps {
  onClose: () => void;
  onReset: () => void;
  errorMessage?: string | null;
}

const FailedState: React.FC<FailedStateProps> = ({
  onClose,
  onReset,
  errorMessage
}) => {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <AlertOctagon className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium">Processing Failed</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {errorMessage || "There was a problem processing your utility bill. Please try again or upload a different file."}
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
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
