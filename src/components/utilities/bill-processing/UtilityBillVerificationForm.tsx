
import React from 'react';
import { 
  ExtractedUtilityData, 
  ConfidenceScores 
} from '@/types/utility';
import BillVerificationForm from './verification/BillVerificationForm';

interface UtilityBillVerificationFormProps {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  onSave: (verifiedData: ExtractedUtilityData) => Promise<void>;
  onCancel: () => void;
  isFallbackData: boolean;
  documentType: string;
}

const UtilityBillVerificationForm: React.FC<UtilityBillVerificationFormProps> = ({
  extractedData,
  confidenceScores,
  onSave,
  onCancel,
  isFallbackData,
  documentType
}) => {
  return (
    <BillVerificationForm
      extractedData={extractedData}
      confidenceScores={confidenceScores}
      onSave={onSave}
      onCancel={onCancel}
      isFallbackData={isFallbackData}
      documentType={documentType}
    />
  );
};

export default UtilityBillVerificationForm;
