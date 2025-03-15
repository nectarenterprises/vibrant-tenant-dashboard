
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ExtractedUtilityData, ConfidenceScores, UtilityType } from '@/types/utility';
import { AlertCircle } from 'lucide-react';

// Import verification field components
import DateField from './verification/DateField';
import AmountField from './verification/AmountField';
import TextField from './verification/TextField';
import UtilityTypeField from './verification/UtilityTypeField';

interface UtilityBillVerificationFormProps {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  onSave: (verifiedData: ExtractedUtilityData) => void;
  onCancel: () => void;
  isFallbackData?: boolean;
}

const UtilityBillVerificationForm: React.FC<UtilityBillVerificationFormProps> = ({
  extractedData,
  confidenceScores,
  onSave,
  onCancel,
  isFallbackData = false
}) => {
  const [formData, setFormData] = useState<ExtractedUtilityData>({...extractedData});
  
  const handleChange = (field: keyof ExtractedUtilityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="py-2 space-y-4">
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
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <UtilityTypeField 
            value={formData.utilityType}
            confidenceScore={confidenceScores.utilityType}
            onChange={(value) => handleChange('utilityType', value)}
          />
          
          <DateField 
            label="Bill Date"
            fieldName="billDate"
            value={formData.billDate}
            confidenceScore={confidenceScores.billDate}
            onChange={(value) => handleChange('billDate', value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <DateField 
            label="Period Start"
            fieldName="periodStart"
            value={formData.periodStart}
            confidenceScore={confidenceScores.periodStart}
            onChange={(value) => handleChange('periodStart', value)}
          />
          
          <DateField 
            label="Period End"
            fieldName="periodEnd"
            value={formData.periodEnd}
            confidenceScore={confidenceScores.periodEnd}
            onChange={(value) => handleChange('periodEnd', value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <AmountField 
            label="Total Amount"
            fieldName="totalAmount"
            value={formData.totalAmount}
            confidenceScore={confidenceScores.totalAmount}
            onChange={(value) => handleChange('totalAmount', value)}
            prefix="£"
          />
          
          <TextField 
            label="Meter Reference"
            fieldName="meterReference"
            value={formData.meterReference}
            confidenceScore={confidenceScores.meterReference}
            onChange={(value) => handleChange('meterReference', value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <AmountField 
            label="Usage Quantity"
            fieldName="usageQuantity"
            value={formData.usageQuantity || 0}
            confidenceScore={confidenceScores.usageQuantity}
            onChange={(value) => handleChange('usageQuantity', value)}
            prefix=""
          />
          
          <TextField 
            label="Usage Unit"
            fieldName="usageUnit"
            value={formData.usageUnit}
            confidenceScore={confidenceScores.usageUnit}
            onChange={(value) => handleChange('usageUnit', value)}
          />
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="bg-tenant-green hover:bg-tenant-darkGreen"
        >
          Save & Process
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UtilityBillVerificationForm;
