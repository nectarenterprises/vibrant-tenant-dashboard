
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FormHeaderProps {
  isFallbackData: boolean;
  documentType?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isFallbackData, documentType = 'utility bill' }) => {
  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case 'utility':
        return 'utility bill';
      case 'lease':
        return 'lease agreement';
      case 'service-charge':
        return 'service charge budget';
      case 'compliance':
        return 'compliance document';
      default:
        return documentType;
    }
  };
  
  const documentTypeLabel = getDocumentTypeLabel();
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Verify Extracted Data</h3>
      <p className="text-gray-500 mb-4">
        Please review the extracted {documentTypeLabel} information below and make any necessary corrections.
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
