
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ServiceChargeComparison, BudgetComparisonProps } from '@/types/service-charge';
import { cn } from '@/lib/utils';

const BudgetComparison: React.FC<BudgetComparisonProps> = ({ property }) => {
  const [comparisonYear, setComparisonYear] = useState<string>('2022');
  const currentYear = '2023';
  
  // Mock data for budget comparison
  const comparisonData: ServiceChargeComparison[] = [
    { category: 'Maintenance', currentYear: 6300, previousYear: 5800, percentChange: 8.62 },
    { category: 'Security', currentYear: 4200, previousYear: 3900, percentChange: 7.69 },
    { category: 'Cleaning', currentYear: 3360, previousYear: 3300, percentChange: 1.82 },
    { category: 'Utilities', currentYear: 5040, previousYear: 4800, percentChange: 5.00 },
    { category: 'Insurance', currentYear: 2100, previousYear: 2500, percentChange: -16.00 },
    { category: 'Management Fee', currentYear: 2520, previousYear: 2400, percentChange: 5.00 }
  ];
  
  const formatCurrency = (value: number): string => {
    return `£${value.toLocaleString('en-GB')}`;
  };
  
  const getChangeBadgeColor = (percentChange: number): string => {
    if (percentChange < 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (percentChange <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const getChangeIcon = (percentChange: number) => {
    if (percentChange < 0) return <ArrowDown className="h-3 w-3" />;
    if (percentChange === 0) return <Minus className="h-3 w-3" />;
    return <ArrowUp className="h-3 w-3" />;
  };
  
  const totalCurrent = comparisonData.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPrevious = comparisonData.reduce((sum, item) => sum + item.previousYear, 0);
  const totalPercentChange = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
  
  // Custom tooltip formatter for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="font-mono">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold">Budget Comparison</CardTitle>
          
          <Select value={comparisonYear} onValueChange={setComparisonYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select comparison year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-4 bg-muted/30 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Budget ({currentYear})</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCurrent)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Previous Budget ({comparisonYear})</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">{formatCurrency(totalPrevious)}</p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1",
                    getChangeBadgeColor(totalPercentChange)
                  )}
                >
                  {getChangeIcon(totalPercentChange)}
                  {Math.abs(totalPercentChange).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `£${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar name={`${currentYear} Budget`} dataKey="currentYear" fill="#10b981" />
              <Bar name={`${comparisonYear} Budget`} dataKey="previousYear" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-2 border-b">Category</th>
                  <th className="text-right p-2 border-b">{currentYear}</th>
                  <th className="text-right p-2 border-b">{comparisonYear}</th>
                  <th className="text-right p-2 border-b">Change</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                  >
                    <td className="p-2 border-b">{item.category}</td>
                    <td className="text-right p-2 border-b font-medium">{formatCurrency(item.currentYear)}</td>
                    <td className="text-right p-2 border-b text-muted-foreground">{formatCurrency(item.previousYear)}</td>
                    <td className="text-right p-2 border-b">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "flex items-center gap-1 justify-end ml-auto",
                          getChangeBadgeColor(item.percentChange)
                        )}
                      >
                        {getChangeIcon(item.percentChange)}
                        {Math.abs(item.percentChange).toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-medium">
                  <td className="p-2 border-b">Total</td>
                  <td className="text-right p-2 border-b">
                    {formatCurrency(totalCurrent)}
                  </td>
                  <td className="text-right p-2 border-b">
                    {formatCurrency(totalPrevious)}
                  </td>
                  <td className="text-right p-2 border-b">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 justify-end ml-auto",
                        getChangeBadgeColor(totalPercentChange)
                      )}
                    >
                      {getChangeIcon(totalPercentChange)}
                      {Math.abs(totalPercentChange).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetComparison;
