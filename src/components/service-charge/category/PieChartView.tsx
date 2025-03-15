
import React from 'react';
import { CategoryData } from '../types';
import { StyledPieChart } from '@/components/ui/charts';

interface PieChartViewProps {
  data: CategoryData[];
  formatCurrency: (value: number) => string;
  CustomTooltip: React.FC<any>;
  onCategoryClick: (category: string) => void;
}

const PieChartView: React.FC<PieChartViewProps> = ({ 
  data, 
  formatCurrency, 
  onCategoryClick 
}) => {
  // Calculate the total amount for all categories
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);
  
  // Create chart data with properly calculated percentages
  const chartData = data.map(item => ({
    name: item.category,
    value: item.value,
    percentage: item.value / totalAmount,
    color: item.color
  }));

  return (
    <StyledPieChart
      data={chartData}
      dataKey="value"
      nameKey="name"
      colorKey="color"
      height={400}
      tooltipFormatter={formatCurrency}
      innerRadius={40}
      outerRadius={160}
    />
  );
};

export default PieChartView;
