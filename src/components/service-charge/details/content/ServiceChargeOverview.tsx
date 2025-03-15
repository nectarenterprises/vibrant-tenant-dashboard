
import React from 'react';
import { Property } from '@/types/property';
import ServiceChargeSummaryCard from '../ServiceChargeSummaryCard';
import ChargeBreakdownCard from '../ChargeBreakdownCard';

interface ServiceChargeOverviewProps {
  property: Property;
  serviceCharges: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  totalServiceCharge: number;
}

const ServiceChargeOverview: React.FC<ServiceChargeOverviewProps> = ({
  property,
  serviceCharges,
  totalServiceCharge
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ServiceChargeSummaryCard 
        totalServiceCharge={totalServiceCharge}
        rentalFee={property.rentalFee}
        serviceChargesLength={serviceCharges.length}
      />
      <ChargeBreakdownCard serviceCharges={serviceCharges} />
    </div>
  );
};

export default ServiceChargeOverview;
