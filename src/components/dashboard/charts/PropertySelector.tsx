
import React from 'react';
import { Property } from '@/types/property';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertySelectorProps {
  selectedProperty: string;
  setSelectedProperty: (value: string) => void;
  properties: Property[];
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ 
  selectedProperty, 
  setSelectedProperty, 
  properties 
}) => {
  if (properties.length === 0) return null;
  
  return (
    <div className="mt-2">
      <Select value={selectedProperty} onValueChange={setSelectedProperty}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertySelector;
