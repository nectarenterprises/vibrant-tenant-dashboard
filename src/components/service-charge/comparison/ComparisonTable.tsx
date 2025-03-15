
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceChargeComparisonItem } from './types';

interface ComparisonTableProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
  getChangeColor: (percentChange: number) => string;
  getChangeBadgeColor: (percentChange: number) => string;
  getChangeIcon: (percentChange: number) => React.ReactNode;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  data, 
  formatCurrency, 
  getChangeColor, 
  getChangeBadgeColor, 
  getChangeIcon 
}) => {
  const totalCurrent = data.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previousYear, 0);
  const totalPercentChange = Number((((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1));

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-2 border-b">Category</th>
            <th className="text-right p-2 border-b">Current Year</th>
            <th className="text-right p-2 border-b">Previous Year</th>
            <th className="text-right p-2 border-b">
              <div className="flex items-center justify-end gap-1">
                <ArrowUpDown className="h-4 w-4" />
                <span>Change</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index} 
              className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
            >
              <td className="p-2 border-b">{item.category}</td>
              <td className="text-right p-2 border-b font-medium">{formatCurrency(item.currentYear)}</td>
              <td className="text-right p-2 border-b text-muted-foreground">{formatCurrency(item.previousYear)}</td>
              <td className="text-right p-2 border-b">
                <div className="flex items-center justify-end gap-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "flex items-center gap-1 w-24 h-7 justify-center",
                      getChangeBadgeColor(item.percentChange)
                    )}
                  >
                    {getChangeIcon(item.percentChange)}
                    {Math.abs(item.percentChange).toFixed(1)}%
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
          <tr className="bg-muted/50 font-medium">
            <td className="p-2 border-b">Total</td>
            <td className="text-right p-2 border-b">
              {formatCurrency(totalCurrent)}
            </td>
            <td className="text-right p-2 border-b">
              {formatCurrency(totalPrevious)}
            </td>
            <td className="text-right p-2 border-b">
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1 w-24 h-7 justify-center",
                  getChangeBadgeColor(totalPercentChange)
                )}
              >
                {getChangeIcon(totalPercentChange)}
                {Math.abs(totalPercentChange).toFixed(1)}%
              </Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
