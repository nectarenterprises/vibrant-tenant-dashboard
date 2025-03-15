
import React from 'react';
import { Flame } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

interface GasChartProps {
  data?: Array<{ month: string; usage: number; cost: number }>;
  isLoading?: boolean;
}

const GasChart: React.FC<GasChartProps> = ({ 
  data = [],
  isLoading = false
}) => {
  return (
    <UtilityBaseChart
      data={data}
      title="Gas Usage & Cost"
      Icon={Flame}
      iconColor="text-tenant-orange"
      iconBgColor="bg-orange-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#C2410C"
      usageUnit="m³"
      isLoading={isLoading}
    />
  );
};

export default GasChart;
