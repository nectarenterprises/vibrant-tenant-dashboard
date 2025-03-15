
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ServiceChargeComparisonItem } from './types';

interface ComparisonSummaryProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ data, formatCurrency }) => {
  const getBiggestIncrease = () => {
    return data.reduce((max, current) => 
      current.percentChange > max.percentChange ? current : max, data[0]);
  };

  const getBiggestDecrease = () => {
    return data.reduce((min, current) => 
      current.percentChange < min.percentChange ? current : min, data[0]);
  };

  const getOverallChange = () => {
    const totalCurrent = data.reduce((sum, item) => sum + item.currentYear, 0);
    const totalPrevious = data.reduce((sum, item) => sum + item.previousYear, 0);
    const percentChange = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
    return {
      totalCurrent,
      totalPrevious,
      percentChange: Number(percentChange.toFixed(1))
    };
  };

  const biggestIncrease = getBiggestIncrease();
  const biggestDecrease = getBiggestDecrease();
  const overallChange = getOverallChange();

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Biggest Increase</h3>
            <Badge 
              variant="outline" 
              className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 w-24 h-7 justify-center"
            >
              <ArrowUp className="h-3 w-3" />
              {Math.abs(biggestIncrease.percentChange).toFixed(1)}%
            </Badge>
          </div>
          <p className="text-lg font-semibold mt-1">{biggestIncrease.category}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(biggestIncrease.currentYear)} vs {formatCurrency(biggestIncrease.previousYear)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Biggest Decrease</h3>
            <Badge 
              variant="outline" 
              className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 w-24 h-7 justify-center"
            >
              <ArrowDown className="h-3 w-3" />
              {Math.abs(biggestDecrease.percentChange).toFixed(1)}%
            </Badge>
          </div>
          <p className="text-lg font-semibold mt-1">{biggestDecrease.category}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(biggestDecrease.currentYear)} vs {formatCurrency(biggestDecrease.previousYear)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Overall Change</h3>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 w-24 h-7 justify-center ${
                overallChange.percentChange < 0 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                  : overallChange.percentChange <= 5 
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {overallChange.percentChange < 0 
                ? <ArrowDown className="h-3 w-3" /> 
                : <ArrowUp className="h-3 w-3" />
              }
              {Math.abs(overallChange.percentChange).toFixed(1)}%
            </Badge>
          </div>
          <p className="text-lg font-semibold mt-1">Total Service Charge</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(overallChange.totalCurrent)} vs {formatCurrency(overallChange.totalPrevious)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonSummary;
