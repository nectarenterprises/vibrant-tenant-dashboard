
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  ExtractedUtilityData, 
  ConfidenceScores 
} from '@/types/utility';
import FormHeader from './FormHeader';
import FormFields from './FormFields';
import FormFooter from './FormFooter';

interface BillVerificationFormProps {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  onSave: (verifiedData: ExtractedUtilityData) => Promise<void>;
  onCancel: () => void;
  isFallbackData: boolean;
  documentType: string;
}

const BillVerificationForm: React.FC<BillVerificationFormProps> = ({
  extractedData,
  confidenceScores,
  onSave,
  onCancel,
  isFallbackData,
  documentType
}) => {
  const [formData, setFormData] = useState<ExtractedUtilityData>({
    ...extractedData
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof ExtractedUtilityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNumericChange = (field: keyof ExtractedUtilityData, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    handleChange(field, isNaN(numericValue) ? 0 : numericValue);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(formData);
      toast({
        title: "Data saved",
        description: "The verified data has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving verified data:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving the verified data.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <FormHeader 
        isFallbackData={isFallbackData} 
        documentType={documentType} 
      />
      
      <FormFields
        formData={formData}
        confidenceScores={confidenceScores}
        handleChange={handleChange}
      />
      
      <div className="flex justify-end space-x-2 pt-4">
        <FormFooter 
          onSave={() => {}} // Form submission is handled by the form's onSubmit
          onCancel={onCancel}
          isSaving={isSaving}
        />
      </div>
    </form>
  );
};

export default BillVerificationForm;
