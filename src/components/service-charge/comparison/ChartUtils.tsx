
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ServiceChargeComparisonItem } from './types';

export const renderComparisonBarChart = (data: ServiceChargeComparisonItem[], formatCurrency: (value: number) => string) => {
  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={formatCurrency} />
          <Legend />
          <Bar 
            dataKey="currentYear" 
            name="Current Year" 
            fill="#2D6A4F" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="previousYear" 
            name="Previous Year" 
            fill="#6b7280" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
