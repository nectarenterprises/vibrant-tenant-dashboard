
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertyUtilityDetails from '@/components/utilities/PropertyUtilityDetails';
import UtilitiesHeader from '@/components/utilities/UtilitiesHeader';
import PropertyDisplay from '@/components/utilities/PropertyDisplay';

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { user } = useAuth();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: fetchUserProperties,
    enabled: !!user?.id
  });
  
  const filteredProperties = properties.filter(property => 
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
          <UtilitiesHeader />
          
          {!selectedProperty && (
            <PropertyDisplay 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProperties={filteredProperties}
              propertiesLoading={propertiesLoading}
              onPropertySelect={setSelectedProperty}
            />
          )}

          {selectedProperty && (
            <PropertyUtilityDetails 
              property={selectedProperty}
              onBack={() => setSelectedProperty(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Utilities;
