
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ServiceChargeComparison } from '@/types/service-charge';
import { formatCurrency } from '../../comparison/utils';

interface ComparisonChartProps {
  comparisonData: ServiceChargeComparison[];
  currentYear: string;
  comparisonYear: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  comparisonData,
  currentYear,
  comparisonYear
}) => {
  // Custom tooltip formatter for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="font-mono">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={comparisonData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(value) => `£${value}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar name={`${currentYear} Budget`} dataKey="currentYear" fill="#10b981" />
          <Bar name={`${comparisonYear} Budget`} dataKey="previousYear" fill="#6b7280" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
