
import React, { useState } from 'react';
import { Zap, Droplets, Flame } from 'lucide-react';
import ElectricityChart from '@/components/utilities/ElectricityChart';
import WaterChart from '@/components/utilities/WaterChart';
import GasChart from '@/components/utilities/GasChart';
import { Property } from '@/types/property';

interface UtilityDashboardProps {
  property: Property;
}

type UtilityType = 'electricity' | 'water' | 'gas' | null;

const UtilityDashboard: React.FC<UtilityDashboardProps> = ({ property }) => {
  const [selectedUtility, setSelectedUtility] = useState<UtilityType>(null);

  if (selectedUtility) {
    return (
      <div>
        <button
          onClick={() => setSelectedUtility(null)}
          className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
        >
          ← Back to utilities overview
        </button>

        {selectedUtility === 'electricity' && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Electricity Usage</h3>
            <ElectricityChart />
          </div>
        )}

        {selectedUtility === 'water' && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Water Usage</h3>
            <WaterChart />
          </div>
        )}

        {selectedUtility === 'gas' && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Gas Usage</h3>
            <GasChart />
          </div>
        )}
      </div>
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
