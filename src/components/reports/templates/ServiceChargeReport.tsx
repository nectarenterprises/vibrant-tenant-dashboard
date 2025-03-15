
import React from 'react';
import { Property } from '@/types/property';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface ServiceChargeReportProps {
  property: Property;
}

const ServiceChargeReport: React.FC<ServiceChargeReportProps> = ({ property }) => {
  // Mock data for the service charge categories
  const currentYearData = [
    { category: 'Maintenance', currentYear: 6300, previousYear: 5800, percentChange: 8.62 },
    { category: 'Security', currentYear: 4200, previousYear: 3900, percentChange: 7.69 },
    { category: 'Cleaning', currentYear: 3360, previousYear: 3300, percentChange: 1.82 },
    { category: 'Utilities', currentYear: 5040, previousYear: 4800, percentChange: 5.00 },
    { category: 'Insurance', currentYear: 2100, previousYear: 2500, percentChange: -16.00 },
    { category: 'Management Fee', currentYear: 2520, previousYear: 2400, percentChange: 5.00 }
  ];

  // Data for the pie chart
  const pieChartData = currentYearData.map(item => ({
    name: item.category,
    value: item.currentYear
  }));

  // Colors for the pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Calculate the total service charge
  const totalCurrentYear = currentYearData.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPreviousYear = currentYearData.reduce((sum, item) => sum + item.previousYear, 0);
  const totalPercentChange = ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100;

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };

  // Monthly trend data for the line chart
  const monthlyTrendData = [
    { month: 'Jan', amount: 1925 },
    { month: 'Feb', amount: 1940 },
    { month: 'Mar', amount: 1960 },
    { month: 'Apr', amount: 1970 },
    { month: 'May', amount: 1985 },
    { month: 'Jun', amount: 1990 },
    { month: 'Jul', amount: 2000 },
    { month: 'Aug', amount: 2010 },
    { month: 'Sep', amount: 2020 },
    { month: 'Oct', amount: 2025 },
    { month: 'Nov', amount: 2030 },
    { month: 'Dec', amount: 2040 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Charge Analysis</h1>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <div className="text-right">
          <h2 className="font-medium">{property.name}</h2>
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Year-over-Year Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentYearData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="currentYear" name="Current Year" fill="#8884d8" />
                  <Bar dataKey="previousYear" name="Previous Year" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Year Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalCurrentYear)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Previous Year Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalPreviousYear)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Change</p>
                <p className={`text-xl font-bold ${totalPercentChange > 0 ? 'text-destructive' : 'text-green-600'}`}>
                  {totalPercentChange > 0 ? '+' : ''}{totalPercentChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Monthly Trend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="amount" name="Monthly Service Charge" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-right">Current Year</th>
                    <th className="py-2 px-4 text-right">Previous Year</th>
                    <th className="py-2 px-4 text-right">Change (£)</th>
                    <th className="py-2 px-4 text-right">Change (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentYearData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.currentYear)}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.previousYear)}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.currentYear - item.previousYear)}</td>
                      <td className={`py-2 px-4 text-right ${item.percentChange > 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {item.percentChange > 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-muted/50">
                    <td className="py-2 px-4">Total</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(totalCurrentYear)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(totalPreviousYear)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(totalCurrentYear - totalPreviousYear)}</td>
                    <td className={`py-2 px-4 text-right ${totalPercentChange > 0 ? 'text-destructive' : 'text-green-600'}`}>
                      {totalPercentChange > 0 ? '+' : ''}{totalPercentChange.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceChargeReport;
