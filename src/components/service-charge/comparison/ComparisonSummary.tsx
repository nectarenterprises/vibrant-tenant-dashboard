
import React from 'react';
import { ServiceChargeComparisonItem } from './types';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonSummaryProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ data, formatCurrency }) => {
  // Calculate totals
  const totalCurrentYear = data.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPreviousYear = data.reduce((sum, item) => sum + item.previousYear, 0);
  const totalChange = totalCurrentYear - totalPreviousYear;
  const percentChange = ((totalChange) / totalPreviousYear) * 100;
  
  // Calculate highest increase and decrease
  const sortedByChange = [...data].sort((a, b) => b.percentChange - a.percentChange);
  const highestIncrease = sortedByChange[0];
  const highestDecrease = sortedByChange[sortedByChange.length - 1];
  
  // Get color for the change badge
  const getChangeBadgeColor = (change: number) => {
    if (change < 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (change <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  // Get icon for the change badge
  const getChangeIcon = (change: number) => {
    if (change < 0) return <ArrowDown className="h-3 w-3" />;
    if (change > 0) return <ArrowUp className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-md">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Total Change</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{formatCurrency(totalChange)}</p>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1",
              getChangeBadgeColor(percentChange)
            )}
          >
            {getChangeIcon(percentChange)}
            <span>{Math.abs(percentChange).toFixed(1)}%</span>
          </Badge>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Highest Increase</p>
        <div className="flex items-center gap-2">
          <p className="font-medium">{highestIncrease.category}:</p>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1",
              getChangeBadgeColor(highestIncrease.percentChange)
            )}
          >
            <ArrowUp className="h-3 w-3" />
            <span>{highestIncrease.percentChange.toFixed(1)}%</span>
          </Badge>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Highest Decrease</p>
        <div className="flex items-center gap-2">
          <p className="font-medium">{highestDecrease.category}:</p>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1",
              getChangeBadgeColor(highestDecrease.percentChange)
            )}
          >
            <ArrowDown className="h-3 w-3" />
            <span>{Math.abs(highestDecrease.percentChange).toFixed(1)}%</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSummary;
