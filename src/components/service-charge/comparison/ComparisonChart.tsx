
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ServiceChargeComparisonItem } from './types';

interface ComparisonChartProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, formatCurrency }) => {
  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barGap={0}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(value) => `£${value}`} />
          <Tooltip 
            formatter={(value) => [`£${value}`, '']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend />
          <Bar name="Current Year" dataKey="currentYear" fill="#10b981">
            {data.map((entry, index) => (
              <Cell 
                key={`current-${index}`} 
                fill="#10b981"
              />
            ))}
          </Bar>
          <Bar name="Previous Year" dataKey="previousYear" fill="#6b7280">
            {data.map((entry, index) => (
              <Cell 
                key={`previous-${index}`} 
                fill="#6b7280"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
