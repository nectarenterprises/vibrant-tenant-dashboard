
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Property } from '@/types/property';
import ComplianceDetails from '@/components/compliance/ComplianceDetails';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';

const Compliance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  
  // Fetch real properties instead of using mock data
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: fetchUserProperties,
    enabled: !!user?.id
  });
  
  // Filter properties based on search query
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle propertyId from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const propertyId = params.get('propertyId');
    
    if (propertyId && properties.length > 0) {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [location.search, properties]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Manage and track compliance requirements for your properties</p>
        </div>
        
        {/* Search Bar */}
        {!selectedProperty && (
          <PropertySearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {selectedProperty ? (
          <div>
            <button 
              onClick={() => setSelectedProperty(null)}
              className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
            >
              ← Back to all properties
            </button>
            <ComplianceDetails property={selectedProperty} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyGrid
              filteredProperties={filteredProperties}
              propertiesLoading={propertiesLoading}
              searchQuery={searchQuery}
              onPropertySelect={setSelectedProperty}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Compliance;
