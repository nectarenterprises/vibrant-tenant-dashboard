
import React from 'react';
import { ExtractedUtilityData, ConfidenceScores } from '@/types/utility';
import DateField from './DateField';
import AmountField from './AmountField';
import TextField from './TextField';
import UtilityTypeField from './UtilityTypeField';

interface FormFieldsProps {
  formData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  handleChange: (field: keyof ExtractedUtilityData, value: any) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  confidenceScores,
  handleChange
}) => {
  return (
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
  );
};

export default FormFields;
