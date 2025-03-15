
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UtilityType } from '@/types/utility';
import ConfidenceIndicator from './ConfidenceIndicator';

interface UtilityTypeFieldProps {
  value: UtilityType;
  confidenceScore: number | undefined;
  onChange: (value: UtilityType) => void;
}

const UtilityTypeField: React.FC<UtilityTypeFieldProps> = ({
  value,
  confidenceScore,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor="utilityType">Utility Type</Label>
        <ConfidenceIndicator score={confidenceScore} field="utilityType" />
      </div>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as UtilityType)}
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
  );
};

export default UtilityTypeField;
