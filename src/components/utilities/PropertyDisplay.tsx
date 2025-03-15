
import React, { useEffect } from 'react';
import { Property } from '@/types/property';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';
import { useLocation } from 'react-router-dom';

interface PropertyDisplayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProperties: Property[];
  propertiesLoading: boolean;
  onPropertySelect: (property: Property | null) => void;
}

const PropertyDisplay: React.FC<PropertyDisplayProps> = ({
  searchQuery,
  setSearchQuery,
  filteredProperties,
  propertiesLoading,
  onPropertySelect
}) => {
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters to check for propertyId
    const params = new URLSearchParams(location.search);
    const propertyId = params.get('propertyId');
    
    // If propertyId is in the URL and properties are loaded, find and select the property
    if (propertyId && filteredProperties.length > 0 && !propertiesLoading) {
      const property = filteredProperties.find(p => p.id === propertyId);
      if (property) {
        onPropertySelect(property);
      }
    }
  }, [location.search, filteredProperties, propertiesLoading, onPropertySelect]);

  return (
    <>
      <PropertySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyGrid
          filteredProperties={filteredProperties}
          propertiesLoading={propertiesLoading}
          searchQuery={searchQuery}
          onPropertySelect={onPropertySelect}
        />
      </div>
    </>
  );
};

export default PropertyDisplay;
