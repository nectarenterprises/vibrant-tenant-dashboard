
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getChangeBadgeColor, getChangeIcon, formatCurrency } from '../../comparison/utils';

interface ComparisonSummaryProps {
  currentYear: string;
  comparisonYear: string;
  totalCurrent: number;
  totalPrevious: number;
  totalPercentChange: number;
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  currentYear,
  comparisonYear,
  totalCurrent,
  totalPrevious,
  totalPercentChange
}) => {
  return (
    <div className="mb-4 p-4 bg-muted/30 rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Budget ({currentYear})</p>
          <p className="text-2xl font-bold">{formatCurrency(totalCurrent)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Previous Budget ({comparisonYear})</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">{formatCurrency(totalPrevious)}</p>
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-1",
                getChangeBadgeColor(totalPercentChange)
              )}
            >
              {getChangeIcon(totalPercentChange)}
              {Math.abs(totalPercentChange).toFixed(1)}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSummary;
