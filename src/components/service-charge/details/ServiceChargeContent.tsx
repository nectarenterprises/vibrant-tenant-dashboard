
import React from 'react';
import { Property } from '@/types/property';
import ServiceChargeOverview from './content/ServiceChargeOverview';
import ServiceChargeDetails from './content/ServiceChargeDetails';

interface ServiceChargeContentProps {
  property: Property;
  serviceCharges: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  totalServiceCharge: number;
}

const ServiceChargeContent: React.FC<ServiceChargeContentProps> = ({
  property,
  serviceCharges,
  totalServiceCharge
}) => {
  return (
    <>
      <ServiceChargeOverview 
        property={property}
        serviceCharges={serviceCharges}
        totalServiceCharge={totalServiceCharge}
      />
      <ServiceChargeDetails totalServiceCharge={totalServiceCharge} />
    </>
  );
};

export default ServiceChargeContent;
