
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface BillingHistoryCardProps {
  totalServiceCharge: number;
}

const BillingHistoryCard: React.FC<BillingHistoryCardProps> = ({ totalServiceCharge }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>Last 6 months of service charges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = format(date, 'MMMM yyyy');
            // Add a small random variation to the total
            const variation = (Math.random() * 0.1 - 0.05) * totalServiceCharge;
            const monthlyTotal = totalServiceCharge + variation;
            
            return (
              <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-tenant-green" />
                  </div>
                  <span>{monthName}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">${monthlyTotal.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {monthlyTotal > totalServiceCharge ? '↑' : '↓'} 
                    {Math.abs(((monthlyTotal / totalServiceCharge) - 1) * 100).toFixed(1)}% 
                    from average
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingHistoryCard;
