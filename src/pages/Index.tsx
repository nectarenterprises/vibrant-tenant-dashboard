
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import PropertyCard from '@/components/dashboard/PropertyCard';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import UtilityChart from '@/components/dashboard/UtilityChart';
import Sidebar from '@/components/layout/Sidebar';
import { Property, UtilityData } from '@/types/property';
import { cn } from '@/lib/utils';
import { fetchUserProperties, fetchPropertyEvents } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import { BentoHero } from '@/components/ui/bento-demo';

const mockUtilityData: UtilityData[] = [
  { 
    month: 'Jan', 
    gasUsage: 250, gasCost: 125, 
    waterUsage: 42, waterCost: 36, 
    electricityUsage: 320, electricityCost: 80 
  },
  { 
    month: 'Feb', 
    gasUsage: 280, gasCost: 140, 
    waterUsage: 38, waterCost: 33, 
    electricityUsage: 300, electricityCost: 75 
  },
  { 
    month: 'Mar', 
    gasUsage: 220, gasCost: 110, 
    waterUsage: 45, waterCost: 38, 
    electricityUsage: 340, electricityCost: 85 
  },
  { 
    month: 'Apr', 
    gasUsage: 180, gasCost: 90, 
    waterUsage: 40, waterCost: 34, 
    electricityUsage: 280, electricityCost: 70 
  },
  { 
    month: 'May', 
    gasUsage: 160, gasCost: 80, 
    waterUsage: 43, waterCost: 37, 
    electricityUsage: 290, electricityCost: 72.5 
  },
  { 
    month: 'Jun', 
    gasUsage: 140, gasCost: 70, 
    waterUsage: 48, waterCost: 41, 
    electricityUsage: 350, electricityCost: 87.5 
  }
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['property-events'],
    queryFn: fetchPropertyEvents,
    enabled: !!user
  });
  
  const uniqueProperties = properties.reduce((acc: Property[], current) => {
    const x = acc.find(item => 
      item.name === current.name && 
      item.address === current.address
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
        <p>You need to be logged in to access your properties and dashboard.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out overflow-auto",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <WelcomeHeader userName={user.email?.split('@')[0] || 'User'} />
          
          <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {propertiesLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : uniqueProperties.length === 0 ? (
                <div className="text-center py-10 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No properties found</h3>
                  <p className="text-muted-foreground">Add your first property to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uniqueProperties.map((property, index) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      delay={index}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <CalendarWidget events={events} properties={uniqueProperties} />
            </div>
          </div>
          
          <BentoHero />
          
          <div className="mt-8">
            <UtilityChart data={mockUtilityData} properties={uniqueProperties} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
