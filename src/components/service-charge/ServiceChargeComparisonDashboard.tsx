
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart3, Filter } from 'lucide-react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceChargeComparisonDashboardProps {
  property: Property;
}

const ServiceChargeComparisonDashboard: React.FC<ServiceChargeComparisonDashboardProps> = ({ property }) => {
  const [comparisonPeriod, setComparisonPeriod] = useState<'annual' | 'quarterly'>('annual');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  // Mock data - would be replaced with real data from API
  const currentYearData = [
    { category: 'Maintenance', currentYear: 6300, previousYear: 5800, percentChange: 8.62 },
    { category: 'Security', currentYear: 4200, previousYear: 3900, percentChange: 7.69 },
    { category: 'Cleaning', currentYear: 3360, previousYear: 3300, percentChange: 1.82 },
    { category: 'Utilities', currentYear: 5040, previousYear: 4800, percentChange: 5.00 },
    { category: 'Insurance', currentYear: 2100, previousYear: 2500, percentChange: -16.00 },
    { category: 'Management Fee', currentYear: 2520, previousYear: 2400, percentChange: 5.00 }
  ];
  
  const getChangeColor = (percentChange: number) => {
    if (percentChange < 0) return 'text-emerald-600';
    if (percentChange <= 5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getChangeBadgeColor = (percentChange: number) => {
    if (percentChange < 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (percentChange <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const getBarColor = (percentChange: number) => {
    if (percentChange < 0) return '#10b981'; // emerald-500
    if (percentChange <= 5) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };
  
  const getChangeIcon = (percentChange: number) => {
    if (percentChange < 0) return <ArrowDown className="h-3 w-3" />;
    return <ArrowUp className="h-3 w-3" />;
  };
  
  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">{property.name} - Service Charge Comparison</CardTitle>
              <CardDescription>Comparing service charges across time periods</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={comparisonPeriod} onValueChange={(v: 'annual' | 'quarterly') => setComparisonPeriod(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Year over Year</SelectItem>
                  <SelectItem value="quarterly">Quarter over Quarter</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
              >
                {viewMode === 'chart' ? (
                  <><BarChart3 className="h-4 w-4 mr-2" /> View as Table</>
                ) : (
                  <><Filter className="h-4 w-4 mr-2" /> View as Chart</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'chart' ? (
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentYearData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barGap={0}
                  barCategoryGap="15%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `£${value}`} />
                  <Tooltip 
                    formatter={(value) => [`£${value}`, '']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Legend />
                  <Bar name="Current Year" dataKey="currentYear" fill="#10b981">
                    {currentYearData.map((entry, index) => (
                      <Cell 
                        key={`current-${index}`} 
                        fill="#10b981"
                      />
                    ))}
                  </Bar>
                  <Bar name="Previous Year" dataKey="previousYear" fill="#6b7280">
                    {currentYearData.map((entry, index) => (
                      <Cell 
                        key={`previous-${index}`} 
                        fill="#6b7280"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border-b">Category</th>
                    <th className="text-right p-2 border-b">Current Year</th>
                    <th className="text-right p-2 border-b">Previous Year</th>
                    <th className="text-right p-2 border-b">
                      <div className="flex items-center justify-end gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Change</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentYearData.map((item, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                    >
                      <td className="p-2 border-b">{item.category}</td>
                      <td className="text-right p-2 border-b font-medium">{formatCurrency(item.currentYear)}</td>
                      <td className="text-right p-2 border-b text-muted-foreground">{formatCurrency(item.previousYear)}</td>
                      <td className="text-right p-2 border-b">
                        <div className="flex items-center justify-end gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "flex items-center gap-1",
                              getChangeBadgeColor(item.percentChange)
                            )}
                          >
                            {getChangeIcon(item.percentChange)}
                            {Math.abs(item.percentChange).toFixed(1)}%
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="p-2 border-b">Total</td>
                    <td className="text-right p-2 border-b">
                      {formatCurrency(currentYearData.reduce((sum, item) => sum + item.currentYear, 0))}
                    </td>
                    <td className="text-right p-2 border-b">
                      {formatCurrency(currentYearData.reduce((sum, item) => sum + item.previousYear, 0))}
                    </td>
                    <td className="text-right p-2 border-b">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "flex items-center gap-1",
                          getChangeBadgeColor(3.5) // Overall percentage change
                        )}
                      >
                        {getChangeIcon(3.5)}
                        3.5%
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Biggest Increase</h3>
                  <Badge 
                    variant="outline" 
                    className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                  >
                    <ArrowUp className="h-3 w-3" />
                    8.6%
                  </Badge>
                </div>
                <p className="text-lg font-semibold mt-1">Maintenance</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(6300)} vs {formatCurrency(5800)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Biggest Decrease</h3>
                  <Badge 
                    variant="outline" 
                    className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1"
                  >
                    <ArrowDown className="h-3 w-3" />
                    16.0%
                  </Badge>
                </div>
                <p className="text-lg font-semibold mt-1">Insurance</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(2100)} vs {formatCurrency(2500)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Overall Change</h3>
                  <Badge 
                    variant="outline" 
                    className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
                  >
                    <ArrowUp className="h-3 w-3" />
                    3.5%
                  </Badge>
                </div>
                <p className="text-lg font-semibold mt-1">Total Service Charge</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(currentYearData.reduce((sum, item) => sum + item.currentYear, 0))} vs 
                  {formatCurrency(currentYearData.reduce((sum, item) => sum + item.previousYear, 0))}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeComparisonDashboard;
