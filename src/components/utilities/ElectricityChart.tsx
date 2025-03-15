
import React from 'react';
import { Zap } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

interface ElectricityChartProps {
  data?: Array<{ month: string; usage: number; cost: number }>;
  isLoading?: boolean;
}

const ElectricityChart: React.FC<ElectricityChartProps> = ({ 
  data = [],
  isLoading = false
}) => {
  return (
    <UtilityBaseChart
      data={data}
      title="Electricity Usage & Cost"
      Icon={Zap}
      iconColor="text-tenant-purple"
      iconBgColor="bg-purple-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#4C1D95"
      usageUnit="kWh"
      isLoading={isLoading}
    />
  );
};

export default ElectricityChart;
