
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { Search, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ElectricityChart from '@/components/utilities/ElectricityChart';
import WaterChart from '@/components/utilities/WaterChart';
import GasChart from '@/components/utilities/GasChart';

// Mock data - using the same properties from the dashboard
const mockProperties: Property[] = [
  {
    id: '1',
    name: '123 Main Office',
    address: '123 Main St, Suite 101, San Francisco, CA',
    rentalFee: 2500,
    nextPaymentDate: '2023-04-15',
    leaseExpiry: '2024-03-31',
  },
  {
    id: '2',
    name: 'Downtown Retail',
    address: '456 Market St, San Francisco, CA',
    rentalFee: 3200,
    nextPaymentDate: '2023-04-10',
    leaseExpiry: '2023-12-31',
  }
];

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Filter properties based on search query
  const filteredProperties = mockProperties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedProperty ? (
            <div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
              >
                ← Back to all properties
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-bl-full -mr-6 -mt-6"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Zap className="h-6 w-6 text-tenant-green" />
                    </div>
                    <h2 className="text-2xl font-bold">{selectedProperty.name} - Utilities</h2>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <div 
                    key={property.id} 
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <PropertyCard 
                      property={property} 
                      delay={index} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p>No properties found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Utilities;
