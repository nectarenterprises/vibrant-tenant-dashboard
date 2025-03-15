
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface YearComparisonSummaryProps {
  selectedYear: string;
  currentYear: string;
  currentYearTotal: number;
  previousYearTotal: number;
  percentageChange: number;
  onYearChange: (year: string) => void;
}

const YearComparisonSummary: React.FC<YearComparisonSummaryProps> = ({
  selectedYear,
  currentYear,
  currentYearTotal,
  previousYearTotal,
  percentageChange,
  onYearChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium mr-1">{selectedYear}</span>
          <ArrowLeftRight className="h-4 w-4 mx-1" />
          <span className="font-medium ml-1">{currentYear}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Total Service Charge</p>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-2xl font-semibold">${Math.round(currentYearTotal).toLocaleString()}</p>
            <span className="text-sm text-muted-foreground">/year</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground">vs {selectedYear}</p>
          <div className="flex items-center gap-1 mt-1 justify-end">
            <p className="text-xl font-medium">${Math.round(previousYearTotal).toLocaleString()}</p>
            {percentageChange > 0 ? (
              <div className="flex items-center text-tenant-orange">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{percentageChange.toFixed(1)}%</span>
              </div>
            ) : percentageChange < 0 ? (
              <div className="flex items-center text-tenant-green">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>{percentageChange.toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Minus className="h-4 w-4 mr-1" />
                <span>0%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearComparisonSummary;
