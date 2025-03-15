
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CategoryComparisonCardProps {
  category: string;
  currentAmount: number;
  previousAmount: number;
  currentYear: string;
  selectedYear: string;
}

const CategoryComparisonCard: React.FC<CategoryComparisonCardProps> = ({
  category,
  currentAmount,
  previousAmount,
  currentYear,
  selectedYear
}) => {
  const difference = currentAmount - previousAmount;
  const percentChange = (difference / previousAmount) * 100;
  
  return (
    <Card key={category} className="overflow-hidden">
      <CardContent className="p-4">
        <h4 className="font-medium mb-2">{category}</h4>
        
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{currentYear}:</span>
          <span className="font-medium">${currentAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm mb-3">
          <span className="text-muted-foreground">{selectedYear}:</span>
          <span className="font-medium">${previousAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">Change:</span>
          <div className={`flex items-center text-sm ${
            percentChange > 0 
              ? 'text-tenant-orange' 
              : percentChange < 0 
                ? 'text-tenant-green' 
                : 'text-muted-foreground'
          }`}>
            {percentChange > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : percentChange < 0 ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : (
              <Minus className="h-3 w-3 mr-1" />
            )}
            <span>{percentChange.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryComparisonCard;
