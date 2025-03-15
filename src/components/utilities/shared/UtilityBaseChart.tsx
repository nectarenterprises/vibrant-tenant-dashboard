
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StyledLineChart, TENANT_COLORS } from '@/components/ui/charts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export interface UtilityBaseChartProps {
  data: Array<{ month: string; usage: number; cost: number }>;
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  isLoading?: boolean;
}

const UtilityBaseChart: React.FC<UtilityBaseChartProps> = ({ 
  data, 
  title, 
  Icon, 
  iconColor, 
  iconBgColor, 
  primaryColor, 
  secondaryColor, 
  usageUnit,
  isLoading = false
}) => {
  // Format currency values for the tooltip
  const formatCurrency = (value: number) => `£${value}`;
  
  // Format usage values with units
  const formatUsage = (value: number) => `${value} ${usageUnit}`;

  // Custom formatter function that handles both types of data
  const customTooltipFormatter = (value: number, name?: string) => {
    if (name && name.includes('Usage')) {
      return formatUsage(value);
    }
    if (name && name.includes('Cost')) {
      return formatCurrency(value);
    }
    return value;
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`${iconBgColor} p-4 rounded-full mb-4`}>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">No {title} Data Available</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Upload your utility bills to track your usage and costs over time.
      </p>
    </div>
  );

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
      
      {isLoading ? (
        <div className="py-8">
          <LoadingSpinner size="md" className="mx-auto" />
        </div>
      ) : data.length === 0 ? (
        renderEmptyState()
      ) : (
        <StyledLineChart
          data={data}
          lines={[
            { 
              dataKey: 'usage', 
              stroke: TENANT_COLORS.chartGreen,
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
          tooltipFormatter={customTooltipFormatter}
          showGrid={false}
        />
      )}
    </div>
  );
};

export default UtilityBaseChart;
