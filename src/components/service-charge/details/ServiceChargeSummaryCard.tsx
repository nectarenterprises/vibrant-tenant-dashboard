
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, ArrowUpDown, CalendarIcon, PieChart } from 'lucide-react';
import { format } from 'date-fns';

interface ServiceChargeSummaryCardProps {
  totalServiceCharge: number;
  rentalFee: number;
  serviceChargesLength: number;
}

const ServiceChargeSummaryCard: React.FC<ServiceChargeSummaryCardProps> = ({
  totalServiceCharge,
  rentalFee,
  serviceChargesLength,
}) => {
  const nextBillingDate = format(new Date(new Date().setDate(1)), 'MMMM d, yyyy');

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Service Charge Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Total Monthly</span>
          </div>
          <span className="font-medium">${totalServiceCharge.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">% of Rent</span>
          </div>
          <span className="font-medium">{((totalServiceCharge / rentalFee) * 100).toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Next Billing</span>
          </div>
          <span className="font-medium">{nextBillingDate}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Categories</span>
          </div>
          <span className="font-medium">{serviceChargesLength}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceChargeSummaryCard;
