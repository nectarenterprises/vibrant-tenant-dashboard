
import React from 'react';
import { Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StyledLineChart, TENANT_COLORS } from '@/components/ui/charts';
import { useUtilityBills } from '@/hooks/utility/useUtilityBills';

interface WaterChartProps {
  propertyId: string;
}

const WaterChart: React.FC<WaterChartProps> = ({ propertyId }) => {
  const { getUtilityUsageData, isLoadingBills } = useUtilityBills(propertyId);
  
  // Get real water data
  const waterData = getUtilityUsageData('water');
  
  // Format data for chart
  const chartData = waterData.map(item => ({
    month: item.period.split(' - ')[0], // Just use first month for simplicity
    usage: item.usage,
  }));

  const renderEmptyState = () => (
    <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="bg-blue-100 p-3 rounded-full inline-flex mb-3">
          <Droplets className="h-6 w-6 text-tenant-teal" />
        </div>
        <p className="text-sm text-muted-foreground">No water data available</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Droplets className="h-5 w-5 text-tenant-teal" />
            </div>
            <h3 className="font-medium">Water Usage</h3>
          </div>
        </div>
        
        {isLoadingBills ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tenant-teal rounded-full"></div>
          </div>
        ) : chartData.length === 0 ? (
          renderEmptyState()
        ) : (
          <StyledLineChart
            data={chartData}
            lines={[
              { dataKey: 'usage', stroke: TENANT_COLORS.teal, name: 'Usage (m³)' }
            ]}
            xAxisDataKey="month"
            height={180}
            showGrid={false}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WaterChart;
