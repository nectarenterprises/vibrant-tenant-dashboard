
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ConfidenceIndicator from './ConfidenceIndicator';

interface TextFieldProps {
  label: string;
  fieldName: string;
  value: string | undefined;
  confidenceScore: number | undefined;
  onChange: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  fieldName,
  value,
  confidenceScore,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={fieldName}>{label}</Label>
        <ConfidenceIndicator score={confidenceScore} field={fieldName} />
      </div>
      <Input 
        id={fieldName} 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextField;
