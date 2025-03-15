
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FormHeaderProps {
  isFallbackData: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isFallbackData }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Verify Extracted Data</h3>
      <p className="text-gray-500 mb-4">
        Please review the extracted utility bill information below and make any necessary corrections.
      </p>
      
      {isFallbackData && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Simulated Data</AlertTitle>
          <AlertDescription>
            We're using simulated data until Document AI integration is complete. 
            The values below are generated and need to be verified or corrected.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormHeader;
