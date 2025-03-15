
import React from 'react';
import { Droplets } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

interface WaterChartProps {
  data?: Array<{ month: string; usage: number; cost: number }>;
  isLoading?: boolean;
}

const WaterChart: React.FC<WaterChartProps> = ({ 
  data = [],
  isLoading = false
}) => {
  return (
    <UtilityBaseChart
      data={data}
      title="Water Usage & Cost"
      Icon={Droplets}
      iconColor="text-tenant-teal"
      iconBgColor="bg-blue-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#0369A1"
      usageUnit="m³"
      isLoading={isLoading}
    />
  );
};

export default WaterChart;
