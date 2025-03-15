
import React from 'react';
import { Search } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyCard from '@/components/dashboard/PropertyCard';

interface PropertyGridProps {
  filteredProperties: Property[];
  propertiesLoading: boolean;
  searchQuery: string;
  onPropertySelect: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  filteredProperties,
  propertiesLoading,
  searchQuery,
  onPropertySelect
}) => {
  if (propertiesLoading) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading properties...</p>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Search className="h-12 w-12 mb-4 opacity-50" />
        <p>No properties found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <>
      {filteredProperties.map((property, index) => (
        <div 
          key={property.id} 
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => onPropertySelect(property)}
        >
          <PropertyCard 
            property={property} 
            delay={index} 
          />
        </div>
      ))}
    </>
  );
};

export default PropertyGrid;
