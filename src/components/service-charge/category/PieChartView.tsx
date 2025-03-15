
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CategoryData } from '../types';

interface PieChartViewProps {
  data: CategoryData[];
  formatCurrency: (value: number) => string;
  CustomTooltip: React.FC<any>;
  onCategoryClick: (category: string) => void;
}

const PieChartView: React.FC<PieChartViewProps> = ({ 
  data, 
  formatCurrency, 
  CustomTooltip, 
  onCategoryClick 
}) => {
  // Calculate the total amount for all categories once
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);
  
  // Create a new array with properly calculated percentages
  const dataWithCorrectPercentages = data.map(item => ({
    ...item,
    // Calculate percentage as value divided by total (no need to multiply by 100 here since Recharts does that)
    percentage: item.value / totalAmount
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithCorrectPercentages}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
          nameKey="category"
          // Use the pre-calculated percentage directly (will be multiplied by 100 by Recharts)
          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(1)}%`}
          onClick={(data) => onCategoryClick(data.category)}
        >
          {dataWithCorrectPercentages.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartView;
