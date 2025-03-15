
import React from 'react';
import { Property } from '@/types/property';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileClock, FileCheck, FileWarning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DocumentInventoryReportProps {
  property: Property;
}

const DocumentInventoryReport: React.FC<DocumentInventoryReportProps> = ({ property }) => {
  // Mock document data
  const documents = [
    { id: 1, name: 'Lease Agreement', type: 'Lease', created: '2022-06-15', expires: '2025-06-14', status: 'Valid' },
    { id: 2, name: 'Fire Risk Assessment', type: 'Compliance', created: '2023-01-10', expires: '2024-01-09', status: 'Valid' },
    { id: 3, name: 'Electrical Certificate', type: 'Compliance', created: '2022-09-05', expires: '2023-09-04', status: 'Expired' },
    { id: 4, name: 'Service Charge Budget', type: 'Financial', created: '2023-02-20', expires: null, status: 'Valid' },
    { id: 5, name: 'Insurance Certificate', type: 'Insurance', created: '2023-03-15', expires: '2024-03-14', status: 'Valid' },
    { id: 6, name: 'Rent Review Memo', type: 'Lease', created: '2022-11-08', expires: null, status: 'Valid' },
    { id: 7, name: 'Gas Safety Certificate', type: 'Compliance', created: '2022-08-12', expires: '2023-08-11', status: 'Expired' },
    { id: 8, name: 'Building Survey', type: 'Property', created: '2021-05-18', expires: null, status: 'Valid' },
    { id: 9, name: 'Utility Bill - Electricity', type: 'Utility', created: '2023-06-01', expires: null, status: 'Valid' },
    { id: 10, name: 'Air Conditioning Report', type: 'Compliance', created: '2023-04-25', expires: '2024-04-24', status: 'Valid' },
  ];

  // Group documents by type for the chart
  const documentTypes = documents.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(documentTypes).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Count documents by status
  const validCount = documents.filter(doc => doc.status === 'Valid').length;
  const expiredCount = documents.filter(doc => doc.status === 'Expired').length;
  const expiringCount = documents.filter(doc => {
    if (!doc.expires) return false;
    const expiryDate = new Date(doc.expires);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    return doc.status === 'Valid' && expiryDate <= threeMonthsFromNow && expiryDate > now;
  }).length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Inventory</h1>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <div className="text-right">
          <h2 className="font-medium">{property.name}</h2>
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Document Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Document Types</p>
                <p className="text-2xl font-bold">{Object.keys(documentTypes).length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valid Documents</p>
                <p className="text-xl font-medium text-green-600">{validCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expired Documents</p>
                <p className="text-xl font-medium text-destructive">{expiredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileClock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Expiring Documents</CardTitle>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
              {expiringCount} Expiring Soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Document Name</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Expiry Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents
                  .filter(doc => doc.expires)
                  .sort((a, b) => new Date(a.expires!).getTime() - new Date(b.expires!).getTime())
                  .slice(0, 5)
                  .map(doc => (
                    <tr key={doc.id} className="border-b">
                      <td className="py-2 px-4">{doc.name}</td>
                      <td className="py-2 px-4">{doc.type}</td>
                      <td className="py-2 px-4">{formatDate(doc.expires)}</td>
                      <td className="py-2 px-4">
                        {doc.status === 'Valid' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                            Expired
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Document Inventory</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Document Name</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Created Date</th>
                  <th className="py-2 px-4 text-left">Expiry Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} className="border-b">
                    <td className="py-2 px-4">{doc.name}</td>
                    <td className="py-2 px-4">{doc.type}</td>
                    <td className="py-2 px-4">{formatDate(doc.created)}</td>
                    <td className="py-2 px-4">{formatDate(doc.expires)}</td>
                    <td className="py-2 px-4">
                      {doc.status === 'Valid' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          Expired
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Document Compliance Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-800">Valid Documents</h3>
                  <p className="text-2xl font-bold text-green-700">{validCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileWarning className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-medium text-red-800">Expired Documents</h3>
                  <p className="text-2xl font-bold text-red-700">{expiredCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileClock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-medium text-yellow-800">Expiring Soon</h3>
                  <p className="text-2xl font-bold text-yellow-700">{expiringCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-800">Compliance Rate</h3>
                  <p className="text-2xl font-bold text-blue-700">
                    {Math.round((validCount / documents.length) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentInventoryReport;
