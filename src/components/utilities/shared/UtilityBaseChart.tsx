
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StyledLineChart, TENANT_COLORS } from '@/components/ui/styled-chart';

export interface UtilityBaseChartProps {
  data: Array<{ month: string; usage: number; cost: number }>;
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
}

const UtilityBaseChart: React.FC<UtilityBaseChartProps> = ({ 
  data, 
  title, 
  Icon, 
  iconColor, 
  iconBgColor, 
  primaryColor, 
  secondaryColor, 
  usageUnit 
}) => {
  // Format currency values for the tooltip
  const formatCurrency = (value: number) => `£${value}`;
  
  // Format usage values with units
  const formatUsage = (value: number) => `${value} ${usageUnit}`;

  return (
    <div className="utility-chart-container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`${iconBgColor} p-2 rounded-full`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      </div>
      
      <StyledLineChart
        data={data}
        lines={[
          { 
            dataKey: 'usage', 
            stroke: primaryColor,
            name: `Usage (${usageUnit})`
          },
          { 
            dataKey: 'cost', 
            stroke: secondaryColor,
            name: 'Cost (£)'
          }
        ]}
        xAxisDataKey="month"
        height={260}
        tooltipFormatter={(value, name) => {
          if (name.includes('Usage')) {
            return formatUsage(value);
          }
          return formatCurrency(value);
        }}
        showGrid={true}
      />
    </div>
  );
};

export default UtilityBaseChart;
