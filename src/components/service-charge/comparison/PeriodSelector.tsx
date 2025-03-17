
import React from 'react';
import { Button } from '@/components/ui/button';
import { ComparisonPeriod } from './types';

interface PeriodSelectorProps {
  comparisonPeriod: ComparisonPeriod;
  onPeriodChange: (period: ComparisonPeriod) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  comparisonPeriod, 
  onPeriodChange 
}) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant={comparisonPeriod === 'annual' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-none"
        onClick={() => onPeriodChange('annual')}
      >
        Annual
      </Button>
      <Button
        variant={comparisonPeriod === 'quarterly' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-none"
        onClick={() => onPeriodChange('quarterly')}
      >
        Quarterly
      </Button>
    </div>
  );
};

export default PeriodSelector;
