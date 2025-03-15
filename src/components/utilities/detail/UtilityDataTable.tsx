
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UtilityDataPoint {
  month: string;
  usage: number;
  cost: number;
}

interface UtilityDataTableProps {
  data: UtilityDataPoint[];
  usageUnit: string;
}

const UtilityDataTable: React.FC<UtilityDataTableProps> = ({ data, usageUnit }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default UtilityDataTable;
