
import React, { useState } from 'react';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import PropertyCard from '@/components/dashboard/PropertyCard';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import UtilityChart from '@/components/dashboard/UtilityChart';
import Sidebar from '@/components/layout/Sidebar';
import { Property, EventData, UtilityData } from '@/types/property';
import { cn } from '@/lib/utils';

// Mock data
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

const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'Rent Due',
    date: '2023-04-15',
    type: 'rent',
    propertyId: '1',
    propertyName: '123 Main Office'
  },
  {
    id: '2',
    title: 'Quarterly Inspection',
    date: '2023-04-20',
    type: 'inspection',
    propertyId: '2',
    propertyName: 'Downtown Retail'
  },
  {
    id: '3',
    title: 'HVAC Maintenance',
    date: '2023-04-25',
    type: 'maintenance',
    propertyId: '1',
    propertyName: '123 Main Office'
  }
];

const mockUtilityData: UtilityData[] = [
  { date: '2.5', gas: 120, water: 140, electricity: 180 },
  { date: '2.6', gas: 130, water: 150, electricity: 200 },
  { date: '2.7', gas: 110, water: 145, electricity: 190 },
  { date: '2.8', gas: 125, water: 160, electricity: 210 },
  { date: '2.9', gas: 135, water: 170, electricity: 220 }
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
          <WelcomeHeader userName="Jack" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    delay={index} 
                  />
                ))}
              </div>
            </div>
            
            <div>
              <CalendarWidget events={mockEvents} properties={mockProperties} />
            </div>
          </div>
          
          <div className="mt-8">
            <UtilityChart data={mockUtilityData} properties={mockProperties} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
