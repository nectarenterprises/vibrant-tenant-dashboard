
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ExtractedUtilityData, 
  ConfidenceScores, 
  UtilityType 
} from '@/types/utility';
import { WarningIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  
  // Function to check if confidence score is low for a field
  const isLowConfidence = (field: keyof ConfidenceScores) => {
    return confidenceScores[field] !== undefined && confidenceScores[field] < 0.7;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {isFallbackData && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex items-center">
            <WarningIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              We're using simulated data for this {documentType} document. Please verify all fields carefully.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="utilityType" className="flex items-center">
            Utility Type
            {isLowConfidence('utilityType') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Select
            value={formData.utilityType}
            onValueChange={(value) => handleChange('utilityType', value as UtilityType)}
          >
            <SelectTrigger id="utilityType">
              <SelectValue placeholder="Select utility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billDate" className="flex items-center">
            Bill Date
            {isLowConfidence('billDate') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="billDate"
            type="date"
            value={formData.billDate}
            onChange={(e) => handleChange('billDate', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periodStart" className="flex items-center">
            Period Start
            {isLowConfidence('periodStart') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="periodStart"
            type="date"
            value={formData.periodStart}
            onChange={(e) => handleChange('periodStart', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="periodEnd" className="flex items-center">
            Period End
            {isLowConfidence('periodEnd') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="periodEnd"
            type="date"
            value={formData.periodEnd}
            onChange={(e) => handleChange('periodEnd', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalAmount" className="flex items-center">
            Total Amount
            {isLowConfidence('totalAmount') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.01"
            value={formData.totalAmount}
            onChange={(e) => handleNumericChange('totalAmount', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="usageQuantity" className="flex items-center">
            Usage Quantity
            {isLowConfidence('usageQuantity') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="usageQuantity"
            type="number"
            step="0.01"
            value={formData.usageQuantity || ''}
            onChange={(e) => handleNumericChange('usageQuantity', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="usageUnit" className="flex items-center">
            Usage Unit
            {isLowConfidence('usageUnit') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="usageUnit"
            type="text"
            value={formData.usageUnit || ''}
            onChange={(e) => handleChange('usageUnit', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meterReference" className="flex items-center">
            Meter Reference
            {isLowConfidence('meterReference') && (
              <span className="ml-2 text-yellow-500 text-xs">Low confidence</span>
            )}
          </Label>
          <Input
            id="meterReference"
            type="text"
            value={formData.meterReference || ''}
            onChange={(e) => handleChange('meterReference', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default UtilityBillVerificationForm;
