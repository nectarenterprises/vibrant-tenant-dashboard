
import React, { useState } from 'react';
import { ExtractedUtilityData, ConfidenceScores } from '@/types/utility';
import FormHeader from './verification/FormHeader';
import FormFields from './verification/FormFields';
import FormFooter from './verification/FormFooter';

interface UtilityBillVerificationFormProps {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  onSave: (verifiedData: ExtractedUtilityData) => void;
  onCancel: () => void;
  isFallbackData?: boolean;
  documentType?: string;
}

const UtilityBillVerificationForm: React.FC<UtilityBillVerificationFormProps> = ({
  extractedData,
  confidenceScores,
  onSave,
  onCancel,
  isFallbackData = false,
  documentType = 'utility'
}) => {
  const [formData, setFormData] = useState<ExtractedUtilityData>({...extractedData});
  
  const handleChange = (field: keyof ExtractedUtilityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };
  
  return (
    <div className="py-2 space-y-4">
      <FormHeader isFallbackData={isFallbackData} documentType={documentType} />
      <FormFields 
        formData={formData}
        confidenceScores={confidenceScores}
        handleChange={handleChange}
      />
      <FormFooter
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default UtilityBillVerificationForm;
