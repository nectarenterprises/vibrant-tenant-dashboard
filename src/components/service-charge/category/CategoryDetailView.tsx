
import React from 'react';
import { CategoryData, SubcategoryData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface CategoryDetailViewProps {
  selectedCategory: string;
  categoryData: CategoryData[];
  subcategories: SubcategoryData[];
  chartType: 'pie' | 'bar';
  formatCurrency: (value: number) => string;
  CustomTooltip: React.FC<any>;
  onBackClick: () => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  selectedCategory,
  categoryData,
  subcategories,
  chartType,
  formatCurrency,
  CustomTooltip,
  onBackClick
}) => {
  const categoryInfo = categoryData.find(c => c.category === selectedCategory);
  
  if (!categoryInfo || subcategories.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No detailed breakdown available for this category</p>
        <Button 
          variant="outline" 
          onClick={onBackClick} 
          className="mt-4"
        >
          Return to overview
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{selectedCategory} Breakdown</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBackClick}
        >
          Back to overview
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={subcategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {subcategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart
                    data={subcategories}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `£${value}`} />
                    <Tooltip formatter={(value) => [`£${value}`, '']} />
                    <Bar dataKey="value">
                      {subcategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total {selectedCategory} Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(categoryInfo.value)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">% of Total Service Charge</p>
                <p className="text-xl font-medium">{categoryInfo.percent}%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Cost per sqft</p>
                <p className="text-xl font-medium">£3.15</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Benchmark Comparison</p>
                <p className="text-xl font-medium text-amber-600">+4.2% above market</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryDetailView;
