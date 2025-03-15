
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertyUtilityDetails from '@/components/utilities/PropertyUtilityDetails';
import UtilitiesHeader from '@/components/utilities/UtilitiesHeader';
import PropertyDisplay from '@/components/utilities/PropertyDisplay';

const Utilities = () => {
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
    <div className="min-h-screen bg-background">
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
    </div>
  );
};

export default Utilities;
