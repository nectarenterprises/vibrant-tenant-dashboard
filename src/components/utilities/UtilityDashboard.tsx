
import React, { useState } from 'react';
import { Zap, Droplets, Flame } from 'lucide-react';
import ElectricityChart from '@/components/utilities/ElectricityChart';
import WaterChart from '@/components/utilities/WaterChart';
import GasChart from '@/components/utilities/GasChart';
import { Property } from '@/types/property';
import UtilityDetailView from './UtilityDetailView';

interface UtilityDashboardProps {
  property: Property;
}

type UtilityType = 'electricity' | 'water' | 'gas' | null;

const UtilityDashboard: React.FC<UtilityDashboardProps> = ({ property }) => {
  const [selectedUtility, setSelectedUtility] = useState<UtilityType>(null);

  // Mock data for electricity usage
  const mockElectricityData = [
    { month: 'Jan', usage: 320, cost: 80 },
    { month: 'Feb', usage: 300, cost: 75 },
    { month: 'Mar', usage: 340, cost: 85 },
    { month: 'Apr', usage: 280, cost: 70 },
    { month: 'May', usage: 290, cost: 72.5 },
    { month: 'Jun', usage: 350, cost: 87.5 }
  ];

  // Mock data for water usage
  const mockWaterData = [
    { month: 'Jan', usage: 42, cost: 36 },
    { month: 'Feb', usage: 38, cost: 33 },
    { month: 'Mar', usage: 45, cost: 38 },
    { month: 'Apr', usage: 40, cost: 34 },
    { month: 'May', usage: 43, cost: 37 },
    { month: 'Jun', usage: 48, cost: 41 }
  ];

  // Mock data for gas usage
  const mockGasData = [
    { month: 'Jan', usage: 250, cost: 125 },
    { month: 'Feb', usage: 280, cost: 140 },
    { month: 'Mar', usage: 220, cost: 110 },
    { month: 'Apr', usage: 180, cost: 90 },
    { month: 'May', usage: 160, cost: 80 },
    { month: 'Jun', usage: 140, cost: 70 }
  ];

  if (selectedUtility === 'electricity') {
    return (
      <UtilityDetailView
        title="Electricity Usage"
        data={mockElectricityData}
        Icon={Zap}
        iconColor="text-tenant-purple"
        iconBgColor="bg-purple-100"
        primaryColor="#8B5CF6"
        secondaryColor="#4C1D95"
        usageUnit="kWh"
        onBack={() => setSelectedUtility(null)}
        propertyId={property.id}
        utilityType="electricity"
      />
    );
  }

  if (selectedUtility === 'water') {
    return (
      <UtilityDetailView
        title="Water Usage"
        data={mockWaterData}
        Icon={Droplets}
        iconColor="text-tenant-teal"
        iconBgColor="bg-blue-100"
        primaryColor="#0EA5E9"
        secondaryColor="#0369A1"
        usageUnit="m³"
        onBack={() => setSelectedUtility(null)}
        propertyId={property.id}
        utilityType="water"
      />
    );
  }

  if (selectedUtility === 'gas') {
    return (
      <UtilityDetailView
        title="Gas Usage"
        data={mockGasData}
        Icon={Flame}
        iconColor="text-tenant-orange"
        iconBgColor="bg-orange-100"
        primaryColor="#F97316"
        secondaryColor="#C2410C"
        usageUnit="m³"
        onBack={() => setSelectedUtility(null)}
        propertyId={property.id}
        utilityType="gas"
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-bl-full -mr-6 -mt-6"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Zap className="h-6 w-6 text-tenant-green" />
          </div>
          <h2 className="text-2xl font-bold">{property.name} - Utilities</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">View and analyze your utility consumption patterns and costs</p>
        
        <div className="space-y-6">
          <div className="cursor-pointer transition-all hover:shadow-md" onClick={() => setSelectedUtility('electricity')}>
            <ElectricityChart />
          </div>
          <div className="cursor-pointer transition-all hover:shadow-md" onClick={() => setSelectedUtility('water')}>
            <WaterChart />
          </div>
          <div className="cursor-pointer transition-all hover:shadow-md" onClick={() => setSelectedUtility('gas')}>
            <GasChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityDashboard;
