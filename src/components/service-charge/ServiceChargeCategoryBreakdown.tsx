
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Property } from '@/types/property';
import PieChartView from './category/PieChartView';
import BarChartView from './category/BarChartView';
import CategorySummary from './category/CategorySummary';
import CategoryDetailView from './category/CategoryDetailView';
import ChartTypeSelector from './category/ChartTypeSelector';
import { CategoryData, SubcategoryData } from './types';

interface ServiceChargeCategoryBreakdownProps {
  property: Property;
}

const ServiceChargeCategoryBreakdown: React.FC<ServiceChargeCategoryBreakdownProps> = ({ property }) => {
  const [timeframe, setTimeframe] = useState<'current' | '1year' | '3year' | 'custom'>('current');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const calculateCategoryData = () => {
    // Define the total amount for all categories
    const totalAmount = 23520;
    
    // Create the categories with values that add up to the total
    // Percentages are calculated based on the value's portion of the total
    return [
      { category: 'Maintenance', value: 6300, percent: (6300/totalAmount) * 100, color: '#f97316' },
      { category: 'Security', value: 4200, percent: (4200/totalAmount) * 100, color: '#3b82f6' },
      { category: 'Cleaning', value: 3360, percent: (3360/totalAmount) * 100, color: '#22c55e' },
      { category: 'Utilities', value: 5040, percent: (5040/totalAmount) * 100, color: '#8b5cf6' },
      { category: 'Insurance', value: 2100, percent: (2100/totalAmount) * 100, color: '#ec4899' },
      { category: 'Management Fee', value: 2520, percent: (2520/totalAmount) * 100, color: '#f59e0b' }
    ];
  };
  
  const categoryData: CategoryData[] = calculateCategoryData();
  
  const getSubcategoryData = (category: string): SubcategoryData[] => {
    switch(category) {
      case 'Maintenance':
        const maintenanceTotal = 6300;
        return [
          { name: 'Building Fabric', value: 2500, percent: (2500/maintenanceTotal) * 100, color: '#f97316' },
          { name: 'HVAC Systems', value: 1600, percent: (1600/maintenanceTotal) * 100, color: '#fb923c' },
          { name: 'Electrical', value: 1200, percent: (1200/maintenanceTotal) * 100, color: '#fdba74' },
          { name: 'Plumbing', value: 1000, percent: (1000/maintenanceTotal) * 100, color: '#fed7aa' }
        ];
      case 'Utilities':
        const utilitiesTotal = 5040;
        return [
          { name: 'Electricity', value: 2800, percent: (2800/utilitiesTotal) * 100, color: '#8b5cf6' },
          { name: 'Water', value: 1200, percent: (1200/utilitiesTotal) * 100, color: '#a78bfa' },
          { name: 'Gas', value: 1040, percent: (1040/utilitiesTotal) * 100, color: '#c4b5fd' }
        ];
      default:
        return [];
    }
  };
  
  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.percent.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCategoryOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Category Breakdown</CardTitle>
              <ChartTypeSelector 
                chartType={chartType} 
                onChartTypeChange={setChartType} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {chartType === 'pie' ? (
                <PieChartView 
                  data={categoryData} 
                  formatCurrency={formatCurrency} 
                  CustomTooltip={CustomTooltip}
                  onCategoryClick={setSelectedCategory}
                />
              ) : (
                <BarChartView 
                  data={categoryData}
                  formatCurrency={formatCurrency}
                  onCategoryClick={setSelectedCategory}
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <CategorySummary 
          property={property}
          categoryData={categoryData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          formatCurrency={formatCurrency}
          onCategorySelect={setSelectedCategory}
        />
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {selectedCategory ? (
        <CategoryDetailView 
          selectedCategory={selectedCategory}
          categoryData={categoryData}
          subcategories={getSubcategoryData(selectedCategory)}
          chartType={chartType}
          formatCurrency={formatCurrency}
          CustomTooltip={CustomTooltip}
          onBackClick={() => setSelectedCategory(null)}
        />
      ) : renderCategoryOverview()}
    </div>
  );
};

export default ServiceChargeCategoryBreakdown;
