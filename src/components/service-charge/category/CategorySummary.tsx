
import React from 'react';
import { CategoryData } from '../types';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySummaryProps {
  property: Property;
  categoryData: CategoryData[];
  timeframe: 'current' | '1year' | '3year' | 'custom';
  setTimeframe: (value: 'current' | '1year' | '3year' | 'custom') => void;
  formatCurrency: (value: number) => string;
  onCategorySelect: (category: string) => void;
}

const CategorySummary: React.FC<CategorySummaryProps> = ({
  property,
  categoryData,
  timeframe,
  setTimeframe,
  formatCurrency,
  onCategorySelect
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Summary Information</CardTitle>
        <CardDescription>Click on a category to see details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">{property.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Period</p>
              <Select value={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Year</SelectItem>
                  <SelectItem value="1year">vs Last Year</SelectItem>
                  <SelectItem value="3year">3 Year Trend</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Total Service Charge</p>
            <p className="text-2xl font-bold">
              {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
            </p>
          </div>
          
          <div className="pt-2 space-y-3">
            <p className="text-sm font-medium">Categories</p>
            {categoryData.map((category, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                onClick={() => onCategorySelect(category.category)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{category.category}</span>
                    <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${category.percent}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySummary;
