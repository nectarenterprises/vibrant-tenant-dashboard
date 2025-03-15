
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ServiceComparisonChartProps {
  chartData: any[];
  currentYear: string;
  selectedYear: string;
}

const ServiceComparisonChart: React.FC<ServiceComparisonChartProps> = ({
  chartData,
  currentYear,
  selectedYear
}) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`$${value}`, '']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          <Bar 
            dataKey={currentYear} 
            name={`${currentYear} Cost`} 
            fill="#2D6A4F" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar 
            dataKey={selectedYear} 
            name={`${selectedYear} Cost`} 
            fill="#74C69D" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceComparisonChart;
