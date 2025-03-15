
import React from 'react';

const ProcessingState: React.FC = () => {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Processing Utility Bill</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Our AI is extracting information from your bill
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tenant-green rounded-full"></div>
      </div>
      
      <p className="text-center text-sm">
        This may take a few moments...
      </p>
    </div>
  );
};

export default ProcessingState;
