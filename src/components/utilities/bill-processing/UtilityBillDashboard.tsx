
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Droplets, Flame, Upload, Calendar, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Property, PropertyDocument } from '@/types/property';
import { useUtilityBills } from '@/hooks/utility/useUtilityBills';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import UtilityBillUploadDialog from './UtilityBillUploadDialog';
import UtilityBillList from './UtilityBillList';
import UtilityAnomalies from './UtilityAnomalies';
import { 
  LineChart, 
  Line,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

interface UtilityBillDashboardProps {
  property: Property;
  utilityDocuments: PropertyDocument[];
  documentsLoading: boolean;
  onUploadClick: () => void;
}

const UtilityBillDashboard: React.FC<UtilityBillDashboardProps> = ({
  property,
  utilityDocuments,
  documentsLoading,
  onUploadClick
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const {
    bills: utilityBills,
    isLoading: isLoadingBills,
    selectedUtilityType,
    setSelectedUtilityType,
    getUtilityUsageData,
    getUtilityCostData,
    detectAnomalies
  } = useUtilityBills(property.id);
  
  // Get data for charts
  const electricityData = getUtilityUsageData('electricity');
  const gasData = getUtilityUsageData('gas');
  const waterData = getUtilityUsageData('water');
  const costData = getUtilityCostData();
  const anomalies = detectAnomalies();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{property.name} - Utility Bills</h2>
          <p className="text-muted-foreground">
            Track, analyze and manage utility bills for this property
          </p>
        </div>
        
        <Button 
          className="bg-tenant-green hover:bg-tenant-darkGreen"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Utility Bill
        </Button>
      </div>
      
      {anomalies.length > 0 && (
        <UtilityAnomalies anomalies={anomalies} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Zap className="h-4 w-4 text-tenant-purple" />
              Electricity Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {electricityData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No electricity data available</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Upload electricity bills to see usage analysis
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Bill
                </Button>
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={electricityData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#8B5CF6" 
                      name="Usage (kWh)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#4C1D95" 
                      name="Cost (£)" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Flame className="h-4 w-4 text-tenant-orange" />
              Gas Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gasData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No gas data available</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Upload gas bills to see usage analysis
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Bill
                </Button>
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={gasData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#F97316" 
                      name="Usage (m³)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#C2410C" 
                      name="Cost (£)" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Droplets className="h-4 w-4 text-tenant-teal" />
              Water Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waterData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No water data available</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Upload water bills to see usage analysis
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Bill
                </Button>
              </div>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={waterData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#0EA5E9" 
                      name="Usage (gallons)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#0369A1" 
                      name="Cost (£)" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Utility Cost Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {costData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No cost data available</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Upload utility bills to see cost comparison charts
              </p>
              <Button 
                variant="outline"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Bills
              </Button>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="electricity" name="Electricity" fill="#8B5CF6" />
                  <Bar dataKey="gas" name="Gas" fill="#F97316" />
                  <Bar dataKey="water" name="Water" fill="#0EA5E9" />
                  <Bar dataKey="other" name="Other" fill="#6B7280" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-md">Utility Bill History</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={selectedUtilityType === 'all' ? 'all' : selectedUtilityType}
                onValueChange={(value) => setSelectedUtilityType(value === 'all' ? 'all' : value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UtilityBillList 
            utilityBills={utilityBills}
            isLoading={isLoadingBills}
            onUploadClick={() => setUploadDialogOpen(true)}
          />
        </CardContent>
      </Card>
      
      <UtilityBillUploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        propertyId={property.id}
      />
    </div>
  );
};

export default UtilityBillDashboard;
