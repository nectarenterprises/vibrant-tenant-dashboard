
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Building, Scissors, DollarSign, Edit, PlusCircle } from 'lucide-react';
import { Incentive } from '@/types/property';
import { Button } from '@/components/ui/button';

interface IncentivesSectionProps {
  incentives?: Incentive[];
  setShowIncentivesDialog: (show: boolean) => void;
  isLoading?: boolean;
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

const IncentivesSection = ({ incentives = [], setShowIncentivesDialog, isLoading }: IncentivesSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Lease Incentives</CardTitle>
          <CardDescription>Special terms and benefits included in the lease</CardDescription>
        </div>
        <Button 
          variant="ghost"
          size="sm"
          className="h-8 w-8"
          onClick={() => setShowIncentivesDialog(true)}
          disabled={isLoading}
        >
          {incentives && incentives.length > 0 ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : incentives && incentives.length > 0 ? (
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
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 border border-dashed border-gray-200 rounded-md">
            <p className="text-muted-foreground italic">No incentives defined for this lease</p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowIncentivesDialog(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Lease Incentives
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncentivesSection;
