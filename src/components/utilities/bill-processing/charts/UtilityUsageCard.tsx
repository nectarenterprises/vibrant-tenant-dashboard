
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface UtilityUsageCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  data: any[];
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  onUploadClick: () => void;
}

const UtilityUsageCard: React.FC<UtilityUsageCardProps> = ({
  title,
  icon: Icon,
  iconColor,
  data,
  primaryColor,
  secondaryColor,
  usageUnit,
  onUploadClick
}) => {
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 text-${iconColor}`} />
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-sm text-muted-foreground">No data available</p>
            <Button variant="outline" size="sm" onClick={onUploadClick}>
              Upload Bill
            </Button>
          </div>
        ) : (
          <div className="h-44 w-full">
            <p>Usage chart would go here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityUsageCard;
