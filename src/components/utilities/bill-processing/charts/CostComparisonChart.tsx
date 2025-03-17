
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CostComparisonChartProps {
  data: any[];
  onUploadClick: () => void;
}

const CostComparisonChart: React.FC<CostComparisonChartProps> = ({
  data,
  onUploadClick
}) => {
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          Cost Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-sm text-muted-foreground">No cost data available</p>
            <Button variant="outline" size="sm" onClick={onUploadClick}>
              Upload Bill
            </Button>
          </div>
        ) : (
          <div className="h-64 w-full">
            <p>Cost comparison chart would go here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostComparisonChart;
