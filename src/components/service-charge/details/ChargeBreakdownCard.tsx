
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceChargeCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ChargeBreakdownCardProps {
  serviceCharges: ServiceChargeCategory[];
}

const ChargeBreakdownCard: React.FC<ChargeBreakdownCardProps> = ({ serviceCharges }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Charge Breakdown</CardTitle>
        <CardDescription>Monthly service charge by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceCharges.map((charge) => (
            <div key={charge.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{charge.category}</span>
                <span className="font-medium">${charge.amount.toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tenant-green"
                  style={{ width: `${charge.percentage * 3}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeBreakdownCard;
