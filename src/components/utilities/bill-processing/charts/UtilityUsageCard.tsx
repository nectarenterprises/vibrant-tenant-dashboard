
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { StyledLineChart } from '@/components/ui/styled-chart';

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
  // Format currency values for the tooltip
  const formatCurrency = (value: number) => `£${value}`;
  
  // Format usage values with units
  const formatUsage = (value: number) => `${value} ${usageUnit}`;

  // Custom formatter for tooltip based on data type
  const customFormatter = (value: number, name?: string) => {
    if (name === 'Usage') return formatUsage(value);
    if (name === 'Cost') return formatCurrency(value);
    return value;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No {title.toLowerCase()} data available</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Upload {title.toLowerCase()} bills to see usage analysis
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Bill
            </Button>
          </div>
        ) : (
          <div className="h-[200px]">
            <StyledLineChart
              data={data}
              lines={[
                { dataKey: 'usage', stroke: primaryColor, name: 'Usage' },
                { dataKey: 'cost', stroke: secondaryColor, name: 'Cost' }
              ]}
              xAxisDataKey="period"
              height={200}
              tooltipFormatter={customFormatter}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityUsageCard;
