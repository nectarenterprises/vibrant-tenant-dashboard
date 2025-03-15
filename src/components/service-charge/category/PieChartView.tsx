
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
          nameKey="category"
          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(1)}%`}
          onClick={(data) => onCategoryClick(data.category)}
        >
          {data.map((entry, index) => (
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
