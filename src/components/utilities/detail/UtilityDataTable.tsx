
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';

interface UtilityDataPoint {
  month: string;
  usage: number;
  cost: number;
}

interface UtilityDataTableProps {
  data: UtilityDataPoint[];
  usageUnit: string;
  isLoading?: boolean;
}

const UtilityDataTable: React.FC<UtilityDataTableProps> = ({ 
  data, 
  usageUnit,
  isLoading = false
}) => {
  const renderEmptyState = () => (
    <div className="text-center py-10 border-dashed border-2 rounded-md border-muted">
      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground font-medium">No usage data available</p>
      <p className="text-sm text-muted-foreground mt-1">
        Upload utility bills to see your usage data here
      </p>
    </div>
  );

  const renderSkeletonRows = () => (
    Array(5).fill(0).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Usage ({usageUnit})</TableHead>
                <TableHead>Cost (£)</TableHead>
                <TableHead>Unit Rate (£/{usageUnit})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderSkeletonRows()}
            </TableBody>
          </Table>
        ) : data.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Usage ({usageUnit})</TableHead>
                <TableHead>Cost (£)</TableHead>
                <TableHead>Unit Rate (£/{usageUnit})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell>{item.usage.toLocaleString()}</TableCell>
                  <TableCell>£{item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    £{(item.cost / item.usage).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityDataTable;
