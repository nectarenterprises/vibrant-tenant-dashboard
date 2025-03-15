
import React from 'react';
import { Property } from '@/types/property';
import ServiceChargeSummaryCard from './ServiceChargeSummaryCard';
import ChargeBreakdownCard from './ChargeBreakdownCard';
import BillingHistoryCard from './BillingHistoryCard';
import ServiceDetailsCard from './ServiceDetailsCard';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceChargeSummaryCard 
          totalServiceCharge={totalServiceCharge}
          rentalFee={property.rentalFee}
          serviceChargesLength={serviceCharges.length}
        />
        <ChargeBreakdownCard serviceCharges={serviceCharges} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <BillingHistoryCard totalServiceCharge={totalServiceCharge} />
        <ServiceDetailsCard />
      </div>
    </>
  );
};

export default ServiceChargeContent;
