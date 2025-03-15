
import React from 'react';
import { Flame } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { TENANT_COLORS } from '@/components/ui/styled-chart';

// Mock data for gas usage
const mockGasData = [
  { month: 'Jan', usage: 250, cost: 125 },
  { month: 'Feb', usage: 280, cost: 140 },
  { month: 'Mar', usage: 220, cost: 110 },
  { month: 'Apr', usage: 180, cost: 90 },
  { month: 'May', usage: 160, cost: 80 },
  { month: 'Jun', usage: 140, cost: 70 }
];

const GasChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={mockGasData}
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
