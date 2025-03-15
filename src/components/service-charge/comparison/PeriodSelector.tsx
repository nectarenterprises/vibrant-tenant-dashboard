
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ComparisonPeriod } from './types';

interface PeriodSelectorProps {
  comparisonPeriod: ComparisonPeriod;
  onPeriodChange: (period: ComparisonPeriod) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ comparisonPeriod, onPeriodChange }) => {
  return (
    <Select 
      value={comparisonPeriod} 
      onValueChange={(v: ComparisonPeriod) => onPeriodChange(v)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="annual">Year over Year</SelectItem>
        <SelectItem value="quarterly">Quarter over Quarter</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
