
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  totalUsage: number;
  totalCost: number;
  averageUsage: number;
  averageCost: number;
  usageUnit: string;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsData> = ({
  totalUsage,
  totalCost,
  averageUsage,
  averageCost,
  usageUnit,
  isLoading = false
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <p className="text-2xl font-bold" data-test-id="total-usage">
              {totalUsage ? totalUsage.toLocaleString() : "0"} {usageUnit}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <p className="text-2xl font-bold" data-test-id="total-cost">
              £{totalCost ? totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <p className="text-2xl font-bold" data-test-id="avg-usage">
              {averageUsage ? averageUsage.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"} {usageUnit}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Cost</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <p className="text-2xl font-bold" data-test-id="avg-cost">
              £{averageCost ? averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
