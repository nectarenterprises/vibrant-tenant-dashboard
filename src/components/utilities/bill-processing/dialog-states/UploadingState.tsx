
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadingStateProps {
  uploadProgress: number;
}

const UploadingState: React.FC<UploadingStateProps> = ({
  uploadProgress
}) => {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Uploading Utility Bill</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please wait while we upload your document
        </p>
      </div>
      
      <Progress value={uploadProgress} className="w-full h-2" />
      
      <p className="text-center text-sm">
        {uploadProgress}% complete
      </p>
    </div>
  );
};

export default UploadingState;
