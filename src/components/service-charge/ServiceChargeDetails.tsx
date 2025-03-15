
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import PropertyHeader from './details/PropertyHeader';
import ServiceChargeContent from './details/ServiceChargeContent';

interface ServiceChargeDetailsProps {
  property: Property;
}

const ServiceChargeDetails: React.FC<ServiceChargeDetailsProps> = ({ property }) => {
  const { rentalFee } = property;
  
  // Mock service charge data - only tenant's costs, not the whole building
  const serviceCharges = [
    { category: 'Maintenance', amount: rentalFee * 0.15, percentage: 15 },
    { category: 'Security', amount: rentalFee * 0.1, percentage: 10 },
    { category: 'Cleaning', amount: rentalFee * 0.08, percentage: 8 },
    { category: 'Utilities', amount: rentalFee * 0.12, percentage: 12 },
    { category: 'Insurance', amount: rentalFee * 0.05, percentage: 5 },
    { category: 'Management Fee', amount: rentalFee * 0.06, percentage: 6 },
  ];
  
  const totalServiceCharge = serviceCharges.reduce((sum, charge) => sum + charge.amount, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <PropertyHeader 
          property={property}
          showComparison={false}
          onToggleComparison={() => {}}
        />
        
        <CardContent className="pt-6">
          <ServiceChargeContent
            property={property}
            serviceCharges={serviceCharges}
            totalServiceCharge={totalServiceCharge}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeDetails;
