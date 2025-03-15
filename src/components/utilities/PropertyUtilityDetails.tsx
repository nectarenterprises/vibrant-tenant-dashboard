
import React from 'react';
import { Property, PropertyDocument } from '@/types/property';
import UtilityDashboard from './UtilityDashboard';

interface PropertyUtilityDetailsProps {
  property: Property;
  onBack: () => void;
}

const PropertyUtilityDetails: React.FC<PropertyUtilityDetailsProps> = ({
  property,
  onBack
}) => {
  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
      >
        ← Back to all properties
      </button>
      
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{property.name} - Utilities Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your property's utility usage and costs
        </p>
      </div>
      
      <UtilityDashboard property={property} />
    </div>
  );
};

export default PropertyUtilityDetails;
