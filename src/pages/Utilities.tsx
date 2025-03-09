
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import ElectricityChart from '@/components/utilities/ElectricityChart';
import WaterChart from '@/components/utilities/WaterChart';
import GasChart from '@/components/utilities/GasChart';

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">Utilities Dashboard</h1>
            <p className="text-muted-foreground">Monitor your property's utility usage and costs</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-bl-full -mr-6 -mt-6"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-tenant-green" />
                  </div>
                  <h2 className="text-2xl font-bold">Monthly Utilities Overview</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">View and analyze your utility consumption patterns and costs</p>
                
                <div className="space-y-6">
                  <ElectricityChart />
                  
                  <WaterChart />
                  
                  <GasChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Utilities;
