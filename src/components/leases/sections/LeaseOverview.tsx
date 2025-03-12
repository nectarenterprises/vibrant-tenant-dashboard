
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CalendarIcon, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface LeaseOverviewProps {
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
}

const LeaseOverview = ({ rentalFee, nextPaymentDate, leaseExpiry }: LeaseOverviewProps) => {
  const formattedNextPayment = nextPaymentDate ? format(parseISO(nextPaymentDate), 'MMMM d, yyyy') : 'Not set';
  const formattedLeaseExpiry = leaseExpiry ? format(parseISO(leaseExpiry), 'MMMM d, yyyy') : 'Not set';
  
  const daysUntilExpiry = leaseExpiry 
    ? Math.ceil((new Date(leaseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Lease Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Monthly Rent</span>
          </div>
          <span className="font-medium">£{rentalFee.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Next Payment</span>
          </div>
          <span className="font-medium">{formattedNextPayment}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-tenant-green" />
            <span className="text-muted-foreground">Lease Expiry</span>
          </div>
          <span className="font-medium">{formattedLeaseExpiry}</span>
        </div>

        {leaseExpiry && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-tenant-green" />
              <span className="text-muted-foreground">Days Remaining</span>
            </div>
            <span className={`font-medium ${daysUntilExpiry < 30 ? 'text-tenant-orange' : ''}`}>
              {daysUntilExpiry} days
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaseOverview;
