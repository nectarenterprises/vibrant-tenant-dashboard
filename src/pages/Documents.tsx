
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { fetchUserProperties } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';
import DocumentCategories from '@/components/documents/DocumentCategories';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { user } = useAuth();
  
  // Fetch properties
  const { 
    data: properties = [], 
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  // Filter properties based on search query
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, show login message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your documents</h1>
        <p>You need to be logged in to access your property documents.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Property Documents</h1>
        
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
            <DocumentCategories property={selectedProperty} />
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

export default Documents;
