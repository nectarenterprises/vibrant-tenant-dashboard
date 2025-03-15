
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ServiceChargeComparison } from '@/types/service-charge';
import { getChangeBadgeColor, getChangeIcon, formatCurrency } from '../../comparison/utils.tsx';

interface ComparisonTableProps {
  comparisonData: ServiceChargeComparison[];
  currentYear: string;
  comparisonYear: string;
  totalCurrent: number;
  totalPrevious: number;
  totalPercentChange: number;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparisonData,
  currentYear,
  comparisonYear,
  totalCurrent,
  totalPrevious,
  totalPercentChange
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-2 border-b">Category</th>
              <th className="text-right p-2 border-b">{currentYear}</th>
              <th className="text-right p-2 border-b">{comparisonYear}</th>
              <th className="text-right p-2 border-b">Change</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
              >
                <td className="p-2 border-b">{item.category}</td>
                <td className="text-right p-2 border-b font-medium">{formatCurrency(item.currentYear)}</td>
                <td className="text-right p-2 border-b text-muted-foreground">{formatCurrency(item.previousYear)}</td>
                <td className="text-right p-2 border-b">
                  <div className="flex justify-end">
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
                <div className="flex justify-end">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
