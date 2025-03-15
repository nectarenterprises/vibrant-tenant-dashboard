
import React from 'react';
import { Flame } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

const GasChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={[]}
      title="Gas Usage & Cost"
      Icon={Flame}
      iconColor="text-tenant-orange"
      iconBgColor="bg-orange-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#C2410C"
      usageUnit="m³"
    />
  );
};

export default GasChart;
