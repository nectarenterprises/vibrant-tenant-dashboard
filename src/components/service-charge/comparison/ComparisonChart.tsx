
import React from 'react';
import { ServiceChargeComparisonItem } from './types';
import { StyledBarChart, TENANT_COLORS } from '@/components/ui/charts';

interface ComparisonChartProps {
  data: ServiceChargeComparisonItem[];
  formatCurrency: (value: number) => string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, formatCurrency }) => {
  return (
    <div className="h-80 mt-4">
      <StyledBarChart
        data={data}
        bars={[
          { 
            dataKey: 'currentYear', 
            fill: TENANT_COLORS.secondary, 
            name: 'Current Year' 
          },
          { 
            dataKey: 'previousYear', 
            fill: '#6b7280', 
            name: 'Previous Year' 
          }
        ]}
        xAxisDataKey="category"
        height={320}
        tooltipFormatter={formatCurrency}
        yAxisTickFormatter={formatCurrency}
        barSize={30}
      />
    </div>
  );
};

export default ComparisonChart;
