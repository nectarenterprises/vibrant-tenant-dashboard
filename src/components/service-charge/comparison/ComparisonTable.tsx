
import React from 'react';
import { ServiceChargeComparisonItem } from './types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
  getChangeColor: (percentChange: number) => string;
  getChangeBadgeColor: (percentChange: number) => string;
  getChangeIcon: (percentChange: number) => React.ReactElement;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  data,
  formatCurrency,
  getChangeColor,
  getChangeBadgeColor,
  getChangeIcon
}) => {
  // Calculate totals
  const totalCurrentYear = data.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPreviousYear = data.reduce((sum, item) => sum + item.previousYear, 0);
  const totalPercentChange = ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100;

  return (
    <div className="relative overflow-x-auto rounded-md border mt-4">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Current Year</th>
            <th className="px-4 py-3 text-right">Previous Year</th>
            <th className="px-4 py-3 text-right">Difference</th>
            <th className="px-4 py-3 text-right">Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3 font-medium">{item.category}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(item.currentYear)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(item.previousYear)}</td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(item.currentYear - item.previousYear)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      getChangeBadgeColor(item.percentChange)
                    )}
                  >
                    {getChangeIcon(item.percentChange)}
                    <span>{Math.abs(item.percentChange).toFixed(1)}%</span>
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
          <tr className="bg-muted/50 font-medium">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-right">{formatCurrency(totalCurrentYear)}</td>
            <td className="px-4 py-3 text-right">{formatCurrency(totalPreviousYear)}</td>
            <td className="px-4 py-3 text-right">
              {formatCurrency(totalCurrentYear - totalPreviousYear)}
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    getChangeBadgeColor(totalPercentChange)
                  )}
                >
                  {getChangeIcon(totalPercentChange)}
                  <span>{Math.abs(totalPercentChange).toFixed(1)}%</span>
                </Badge>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
