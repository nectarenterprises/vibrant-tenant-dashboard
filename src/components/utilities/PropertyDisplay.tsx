
import React from 'react';
import { Property } from '@/types/property';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';

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
