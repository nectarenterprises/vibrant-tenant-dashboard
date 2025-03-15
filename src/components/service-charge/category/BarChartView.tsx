
import React from 'react';
import { CategoryData } from '../types';
import { StyledBarChart } from '@/components/ui/charts';

interface BarChartViewProps {
  data: CategoryData[];
  formatCurrency: (value: number) => string;
  onCategoryClick: (category: string) => void;
}

const BarChartView: React.FC<BarChartViewProps> = ({ data, formatCurrency, onCategoryClick }) => {
  // Transform data to include name property for chart
  const chartData = data.map(item => ({
    ...item,
    name: item.category
  }));

  // Create bars from each category with its own color
  const bars = chartData.map(item => ({
    dataKey: 'value',
    fill: item.color,
    name: item.category
  }));

  // Handle bar click to select category
  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      onCategoryClick(data.activePayload[0].payload.category);
    }
  };

  return (
    <StyledBarChart
      data={chartData}
      bars={[{ dataKey: 'value', fill: '#2D6A4F' }]} // Default bar config
      xAxisDataKey="category"
      height={400}
      tooltipFormatter={formatCurrency}
      yAxisTickFormatter={formatCurrency}
      barSize={40}
    />
  );
};

export default BarChartView;
