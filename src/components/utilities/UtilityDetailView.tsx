
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UtilityData } from '@/types/property';
import { LucideIcon } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';

interface UtilityDetailViewProps {
  title: string;
  data: Array<{ month: string; usage: number; cost: number }>;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  onBack: () => void;
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({
  title,
  data,
  Icon,
  iconColor,
  iconBgColor,
  primaryColor,
  secondaryColor,
  usageUnit,
  onBack
}) => {
  const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
  const totalCost = data.reduce((acc, item) => acc + item.cost, 0);
  const averageUsage = totalUsage / data.length || 0;
  const averageCost = totalCost / data.length || 0;

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
      >
        ← Back to utilities overview
      </button>

      <div className="flex items-center gap-2 mb-4">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title} Detail View</h2>
      </div>

      <UtilityBaseChart
        data={data}
        title={title}
        Icon={Icon}
        iconColor={iconColor}
        iconBgColor={iconBgColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        usageUnit={usageUnit}
      />

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
    </div>
  );
};

export default UtilityDetailView;
