
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormHeaderProps {
  isFallbackData: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isFallbackData }) => {
  return (
    <>
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-medium mb-1">Please verify the extracted information</h3>
        <p className="text-xs text-muted-foreground">
          Our AI has extracted the following information from your utility bill. 
          Please verify the accuracy and make corrections if needed.
        </p>
      </div>
      
      {isFallbackData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Using simulated data</h3>
            <p className="text-xs text-yellow-700">
              The document processing service could not accurately extract data from your bill. 
              We've generated estimated values which you should carefully review and correct.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FormHeader;
