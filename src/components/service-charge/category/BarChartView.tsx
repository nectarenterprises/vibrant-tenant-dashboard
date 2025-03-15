
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { CategoryData } from '../types';

interface BarChartViewProps {
  data: CategoryData[];
  formatCurrency: (value: number) => string;
  onCategoryClick: (category: string) => void;
}

const BarChartView: React.FC<BarChartViewProps> = ({ data, onCategoryClick }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        onClick={(data) => data && data.activePayload && onCategoryClick(data.activePayload[0].payload.category)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis tickFormatter={(value) => `£${value}`} />
        <Tooltip formatter={(value) => [`£${value}`, '']} />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartView;
