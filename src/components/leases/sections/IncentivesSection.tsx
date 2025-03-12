
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Building, Scissors, DollarSign } from 'lucide-react';
import { Incentive } from '@/types/property';

interface IncentivesSectionProps {
  incentives?: Incentive[];
}

const IncentiveIcon = ({ type }: { type: Incentive['type'] }) => {
  switch (type) {
    case 'rent-free':
      return <Gift className="h-4 w-4 text-tenant-green" />;
    case 'fitout':
      return <Building className="h-4 w-4 text-tenant-green" />;
    case 'break-option':
      return <Scissors className="h-4 w-4 text-tenant-green" />;
    default:
      return <DollarSign className="h-4 w-4 text-tenant-green" />;
  }
};

const IncentivesSection = ({ incentives = [] }: IncentivesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease Incentives</CardTitle>
        <CardDescription>Special terms and benefits included in the lease</CardDescription>
      </CardHeader>
      <CardContent>
        {incentives && incentives.length > 0 ? (
          <div className="space-y-4">
            {incentives.map((incentive, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center mt-1">
                  <IncentiveIcon type={incentive.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      {incentive.type === 'rent-free' ? 'Rent Free Period' :
                       incentive.type === 'fitout' ? 'Fitout Contribution' :
                       incentive.type === 'break-option' ? 'Break Option' : 
                       'Other Incentive'}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {incentive.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm">{incentive.description}</p>
                  {incentive.value && (
                    <p className="text-sm mt-1 font-medium">£{incentive.value.toLocaleString()}</p>
                  )}
                  {incentive.period && (
                    <p className="text-sm text-muted-foreground">{incentive.period}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No incentives defined for this lease</p>
        )}
      </CardContent>
    </Card>
  );
};

export default IncentivesSection;
