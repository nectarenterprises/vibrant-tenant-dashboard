
import React from 'react';
import { Droplets } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

const WaterChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={[]}
      title="Water Usage & Cost"
      Icon={Droplets}
      iconColor="text-tenant-teal"
      iconBgColor="bg-blue-100"
      primaryColor={TENANT_COLORS.chartGreen}
      secondaryColor="#0369A1"
      usageUnit="m³"
    />
  );
};

export default WaterChart;
