
import React from 'react';
import { Zap } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';

// Mock data for electricity usage
const mockElectricityData = [
  { month: 'Jan', usage: 320, cost: 80 },
  { month: 'Feb', usage: 300, cost: 75 },
  { month: 'Mar', usage: 340, cost: 85 },
  { month: 'Apr', usage: 280, cost: 70 },
  { month: 'May', usage: 290, cost: 72.5 },
  { month: 'Jun', usage: 350, cost: 87.5 }
];

const ElectricityChart: React.FC = () => {
  return (
    <UtilityBaseChart
      data={mockElectricityData}
      title="Electricity Usage & Cost"
      Icon={Zap}
      iconColor="text-tenant-purple"
      iconBgColor="bg-purple-100"
      primaryColor="#8B5CF6"
      secondaryColor="#4C1D95"
      usageUnit="kWh"
    />
  );
};

export default ElectricityChart;
