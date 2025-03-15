
import React from 'react';
import { Zap } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

const ElectricityChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={[]}
      title="Electricity Usage & Cost"
      Icon={Zap}
      iconColor="text-tenant-purple"
      iconBgColor="bg-purple-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#4C1D95"
      usageUnit="kWh"
    />
  );
};

export default ElectricityChart;
