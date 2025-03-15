
import React from 'react';
import { Droplets } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/charts';

// Mock data for water usage
const mockWaterData = [
  { month: 'Jan', usage: 42, cost: 36 },
  { month: 'Feb', usage: 38, cost: 33 },
  { month: 'Mar', usage: 45, cost: 38 },
  { month: 'Apr', usage: 40, cost: 34 },
  { month: 'May', usage: 43, cost: 37 },
  { month: 'Jun', usage: 48, cost: 41 }
];

const WaterChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={mockWaterData}
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
