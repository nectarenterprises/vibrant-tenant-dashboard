
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ConfidenceIndicator from './ConfidenceIndicator';

interface AmountFieldProps {
  label: string;
  fieldName: string;
  value: number;
  confidenceScore: number | undefined;
  onChange: (value: number) => void;
  prefix?: string;
  type?: 'number' | 'text';
  step?: string;
}

const AmountField: React.FC<AmountFieldProps> = ({
  label,
  fieldName,
  value,
  confidenceScore,
  onChange,
  prefix = '£',
  type = 'number',
  step = '0.01'
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={fieldName}>{label}</Label>
        <ConfidenceIndicator score={confidenceScore} field={fieldName} />
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2">{prefix}</span>}
        <Input 
          id={fieldName} 
          value={value || ''} 
          onChange={(e) => onChange(type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value as any)}
          className={prefix ? "pl-8" : ""}
          type={type}
          step={type === 'number' ? step : undefined}
        />
      </div>
    </div>
  );
};

export default AmountField;
