
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke={primaryColor} 
                  name={`Usage (${usageUnit})`} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke={secondaryColor} 
                  name="Cost (£)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityUsageCard;
