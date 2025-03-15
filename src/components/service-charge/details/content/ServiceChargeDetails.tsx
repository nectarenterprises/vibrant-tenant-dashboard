
import React from 'react';
import BillingHistoryCard from '../BillingHistoryCard';
import ServiceDetailsCard from '../ServiceDetailsCard';

interface ServiceChargeDetailsProps {
  totalServiceCharge: number;
}

const ServiceChargeDetails: React.FC<ServiceChargeDetailsProps> = ({
  totalServiceCharge
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <BillingHistoryCard totalServiceCharge={totalServiceCharge} />
      <ServiceDetailsCard />
    </div>
  );
};

export default ServiceChargeDetails;
