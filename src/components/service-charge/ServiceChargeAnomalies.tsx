
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Filter, Search, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, HelpCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface ServiceChargeAnomaliesProps {
  property: Property;
}

// Mock data - would be replaced with real data from API
const mockAnomalies = [
  {
    id: '1',
    propertyId: '1',
    category: 'Cleaning',
    previousAmount: 3300,
    currentAmount: 3800,
    percentageChange: 15.2,
    detectedAt: '2023-05-15',
    status: 'new',
    notes: null,
    periodType: 'annual',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
  },
  {
    id: '2',
    propertyId: '1',
    category: 'Security',
    previousAmount: 4200,
    currentAmount: 4600,
    percentageChange: 9.5,
    detectedAt: '2023-05-15',
    status: 'under_review',
    notes: 'Checking with security contractor about personnel increases.',
    periodType: 'annual',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
  },
  {
    id: '3',
    propertyId: '1',
    category: 'Utilities',
    previousAmount: 5200,
    currentAmount: 6500,
    percentageChange: 25.0,
    detectedAt: '2023-05-15',
    status: 'explained',
    notes: 'Confirmed increase due to energy price rises across the market.',
    periodType: 'annual',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
  },
  {
    id: '4',
    propertyId: '1',
    category: 'Management Fee',
    previousAmount: 2400,
    currentAmount: 3000,
    percentageChange: 25.0,
    detectedAt: '2023-05-15',
    status: 'requires_action',
    notes: 'No justification provided for 25% increase. Need to query with landlord.',
    periodType: 'annual',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
  },
  {
    id: '5',
    propertyId: '2',
    category: 'Insurance',
    previousAmount: 2200,
    currentAmount: 2400,
    percentageChange: 9.1,
    detectedAt: '2023-05-16',
    status: 'resolved',
    notes: 'Received confirmation of increased building valuation resulting in higher premium.',
    periodType: 'annual',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
  },
];

const ServiceChargeAnomalies: React.FC<ServiceChargeAnomaliesProps> = ({ property }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Under Review</Badge>;
      case 'explained':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Explained</Badge>;
      case 'requires_action':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Requires Action</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'under_review':
        return <HelpCircle className="h-5 w-5 text-amber-500" />;
      case 'explained':
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      case 'requires_action':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return null;
    }
  };
  
  // Filter anomalies based on property ID, filter, and search query
  const filteredAnomalies = mockAnomalies.filter(anomaly => {
    const matchesProperty = anomaly.propertyId === property.id;
    const matchesFilter = filter === 'all' || anomaly.status === filter;
    const matchesSearch = 
      anomaly.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (anomaly.notes && anomaly.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesProperty && matchesFilter && matchesSearch;
  });
  
  const getPercentChangeColorClass = (percentChange: number) => {
    if (percentChange <= 5) return 'text-emerald-600';
    if (percentChange <= 10) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const formatAmount = (amount: number) => {
    return `£${amount.toLocaleString('en-GB')}`;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">{property.name} - Service Charge Anomalies</CardTitle>
              <CardDescription>
                Automatically detected unusual service charge increases or variances
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" /> Set Threshold
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart3 className="h-4 w-4" /> View Report
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anomalies..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="explained">Explained</SelectItem>
                <SelectItem value="requires_action">Requires Action</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredAnomalies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Previous</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnomalies.map((anomaly) => (
                    <TableRow key={anomaly.id}>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusIcon(anomaly.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{anomaly.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatAmount(anomaly.previousAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatAmount(anomaly.currentAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "flex items-center justify-end font-medium",
                          getPercentChangeColorClass(anomaly.percentageChange)
                        )}>
                          {anomaly.percentageChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {anomaly.percentageChange.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate text-sm">
                          {anomaly.notes || "No notes added yet"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getStatusBadge(anomaly.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Reviewed</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Explained</DropdownMenuItem>
                              <DropdownMenuItem>Flag for Action</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No anomalies detected</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No anomalies match "${searchQuery}"`
                  : "No significant service charge increases or anomalies detected for this property"
                }
              </p>
              <Button variant="outline">
                Adjust Detection Thresholds
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAnomalies.length} of {mockAnomalies.filter(a => a.propertyId === property.id).length} anomalies
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={filteredAnomalies.length === 0}>
              Export
            </Button>
            <Button variant="outline" size="sm" disabled={filteredAnomalies.length === 0}>
              Create Query
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceChargeAnomalies;
