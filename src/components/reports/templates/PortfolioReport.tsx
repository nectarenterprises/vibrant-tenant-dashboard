
import React from 'react';
import { Property } from '@/types/property';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Banknote, MapPin, Calculator } from 'lucide-react';

interface PortfolioReportProps {
  properties: Property[];
}

const PortfolioReport: React.FC<PortfolioReportProps> = ({ properties }) => {
  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate portfolio totals
  const totalRent = properties.reduce((sum, property) => sum + property.rentalFee, 0);
  const totalServiceCharge = properties.reduce((sum, property) => sum + (property.serviceChargeAmount || 0), 0);
  const totalAnnualCost = (totalRent + totalServiceCharge) * 12;

  // Mock property types for the pie chart
  const propertyTypes = ['Office', 'Retail', 'Industrial', 'Mixed-Use', 'Other'];
  const typeDistribution = properties.map((property, index) => ({
    name: propertyTypes[index % propertyTypes.length],
    value: 1
  }));

  // Aggregate property types for chart
  const typeCount = typeDistribution.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock regions for properties
  const regions = ['London', 'South East', 'North West', 'Scotland', 'Wales', 'Midlands'];

  // Prepare data for bar chart
  const rentData = properties.map((property, index) => ({
    name: property.name,
    rent: property.rentalFee,
    serviceCharge: property.serviceChargeAmount || 0,
    region: regions[index % regions.length]
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Properties</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{properties.length}</div>
            <p className="text-sm text-muted-foreground">Total properties in portfolio</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">By Type</p>
                <div className="mt-1 space-y-1">
                  {Object.entries(typeCount).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm">{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Active:</span>
                    <span className="font-medium">{properties.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRent)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Service Charge</p>
                <p className="text-2xl font-bold">{formatCurrency(totalServiceCharge)}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Annual Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAnnualCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Property Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Rent & Service Charge by Property</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `£${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="rent" name="Monthly Rent" fill="#8884d8" />
                <Bar dataKey="serviceCharge" name="Service Charge" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Properties Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Property</th>
                  <th className="py-2 px-4 text-left">Region</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-right">Monthly Rent</th>
                  <th className="py-2 px-4 text-right">Service Charge</th>
                  <th className="py-2 px-4 text-left">Lease Expiry</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr key={property.id} className="border-b">
                    <td className="py-2 px-4">
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground">{property.address}</div>
                    </td>
                    <td className="py-2 px-4">{regions[index % regions.length]}</td>
                    <td className="py-2 px-4">{propertyTypes[index % propertyTypes.length]}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(property.rentalFee)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(property.serviceChargeAmount || 0)}</td>
                    <td className="py-2 px-4">{formatDate(property.leaseExpiry)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/50">
                  <td className="py-2 px-4" colSpan={3}>Portfolio Total</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(totalRent)}</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(totalServiceCharge)}</td>
                  <td className="py-2 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioReport;
