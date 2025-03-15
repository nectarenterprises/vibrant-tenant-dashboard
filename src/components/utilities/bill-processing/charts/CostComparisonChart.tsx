
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';
import { StyledBarChart, TENANT_COLORS } from '@/components/ui/charts';

interface CostComparisonChartProps {
  data: any[];
  onUploadClick: () => void;
}

const CostComparisonChart: React.FC<CostComparisonChartProps> = ({ data, onUploadClick }) => {
  // Format currency values for the tooltip
  const formatCurrency = (value: number) => `£${value}`;

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Utility Cost Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No cost data available</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Upload utility bills to see cost comparison charts
            </p>
            <Button 
              variant="outline"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Bills
            </Button>
          </div>
        ) : (
          <div className="h-[300px]">
            <StyledBarChart
              data={data}
              bars={[
                { dataKey: 'electricity', fill: TENANT_COLORS.purple, name: 'Electricity' },
                { dataKey: 'gas', fill: TENANT_COLORS.orange, name: 'Gas' },
                { dataKey: 'water', fill: TENANT_COLORS.teal, name: 'Water' },
                { dataKey: 'other', fill: '#6B7280', name: 'Other' }
              ]}
              xAxisDataKey="month"
              height={300}
              tooltipFormatter={formatCurrency}
              yAxisTickFormatter={formatCurrency}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostComparisonChart;
