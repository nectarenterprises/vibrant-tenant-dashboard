
import React from 'react';
import { ExtractedUtilityData, ProcessingResult } from '@/types/utility';
import UtilityBillVerificationForm from '../../UtilityBillVerificationForm';

interface VerifyingStateHandlerProps {
  extractionResult: ProcessingResult | null;
  handleSaveVerifiedData: (verifiedData: ExtractedUtilityData) => Promise<void>;
  handleClose: () => void;
  isFallbackData: boolean;
}

const VerifyingStateHandler: React.FC<VerifyingStateHandlerProps> = ({
  extractionResult,
  handleSaveVerifiedData,
  handleClose,
  isFallbackData
}) => {
  if (!extractionResult) return null;
  
  return (
    <UtilityBillVerificationForm 
      extractedData={extractionResult.extractedData}
      confidenceScores={extractionResult.confidenceScores}
      onSave={handleSaveVerifiedData}
      onCancel={handleClose}
      isFallbackData={isFallbackData}
      documentType={extractionResult.documentId ? 'utility' : 'utility'}
    />
  );
};

export default VerifyingStateHandler;
