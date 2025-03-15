
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatsData {
  totalUsage: number;
  totalCost: number;
  averageUsage: number;
  averageCost: number;
  usageUnit: string;
}

const StatsCards: React.FC<StatsData> = ({
  totalUsage,
  totalCost,
  averageUsage,
  averageCost,
  usageUnit
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalUsage.toLocaleString()} {usageUnit}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">£{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{averageUsage.toLocaleString(undefined, { maximumFractionDigits: 0 })} {usageUnit}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">£{averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
