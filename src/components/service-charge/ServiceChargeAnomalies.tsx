
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
import { Property } from '@/types/property';
import { AlertTriangle, CheckCircle, Clock, Filter, Info, Pencil, Search, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ServiceChargeAnomaliesProps {
  property: Property;
}

interface Anomaly {
  id: string;
  propertyId: string;
  propertyName: string;
  category: string;
  previousAmount: number;
  currentAmount: number;
  percentageChange: number;
  detectedAt: string;
  status: 'new' | 'under_review' | 'explained' | 'requires_action' | 'resolved';
  notes?: string;
  periodType: 'annual' | 'quarterly' | 'monthly';
  periodStart: string;
  periodEnd: string;
}

const ServiceChargeAnomalies: React.FC<ServiceChargeAnomaliesProps> = ({ property }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [thresholdFilter, setThresholdFilter] = useState<string>('all');
  
  // Mock data - would be replaced with real data from API
  const anomalies: Anomaly[] = [
    {
      id: '1',
      propertyId: property.id,
      propertyName: property.name,
      category: 'Maintenance',
      previousAmount: 5800,
      currentAmount: 6300,
      percentageChange: 8.62,
      detectedAt: '2023-03-10T09:30:00Z',
      status: 'new',
      periodType: 'annual',
      periodStart: '2023-01-01',
      periodEnd: '2023-12-31'
    },
    {
      id: '2',
      propertyId: property.id,
      propertyName: property.name,
      category: 'Security',
      previousAmount: 3900,
      currentAmount: 4200,
      percentageChange: 7.69,
      detectedAt: '2023-03-10T09:30:00Z',
      status: 'under_review',
      notes: 'Checking with security provider about the increase.',
      periodType: 'annual',
      periodStart: '2023-01-01',
      periodEnd: '2023-12-31'
    },
    {
      id: '3',
      propertyId: property.id,
      propertyName: property.name,
      category: 'Utilities',
      previousAmount: 4800,
      currentAmount: 5040,
      percentageChange: 5.0,
      detectedAt: '2023-03-10T09:30:00Z',
      status: 'explained',
      notes: 'Increase is due to energy price rises which are in line with market trends.',
      periodType: 'annual',
      periodStart: '2023-01-01',
      periodEnd: '2023-12-31'
    },
    {
      id: '4',
      propertyId: property.id,
      propertyName: property.name,
      category: 'Insurance',
      previousAmount: 2500,
      currentAmount: 2100,
      percentageChange: -16.0,
      detectedAt: '2023-03-10T09:30:00Z',
      status: 'resolved',
      notes: 'Reduction negotiated with insurance provider.',
      periodType: 'annual',
      periodStart: '2023-01-01',
      periodEnd: '2023-12-31'
    }
  ];
  
  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'new':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'explained':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'requires_action':
        return <Pencil className="h-4 w-4 text-purple-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'explained':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'requires_action':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return '';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'new':
        return 'New';
      case 'under_review':
        return 'Under Review';
      case 'explained':
        return 'Explained';
      case 'requires_action':
        return 'Requires Action';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };
  
  const getChangeColor = (percentChange: number) => {
    if (percentChange < 0) return 'text-emerald-600';
    if (percentChange <= 5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Apply filters to anomalies
  const filteredAnomalies = anomalies.filter(anomaly => {
    // Status filter
    if (statusFilter !== 'all' && anomaly.status !== statusFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && anomaly.category !== categoryFilter) {
      return false;
    }
    
    // Threshold filter
    if (thresholdFilter !== 'all') {
      if (thresholdFilter === 'high' && anomaly.percentageChange <= 7) {
        return false;
      } else if (thresholdFilter === 'medium' && (anomaly.percentageChange <= 5 || anomaly.percentageChange > 7)) {
        return false;
      } else if (thresholdFilter === 'low' && (anomaly.percentageChange < 0 || anomaly.percentageChange > 5)) {
        return false;
      }
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        anomaly.category.toLowerCase().includes(query) ||
        anomaly.status.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const updateAnomalyStatus = (id: string, newStatus: Anomaly['status'], notes?: string) => {
    // In a real app, this would call an API to update the status
    console.log(`Updating anomaly ${id} to status ${newStatus}${notes ? ` with notes: ${notes}` : ''}`);
    setSelectedAnomaly(null);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Anomaly Detection</CardTitle>
              <CardDescription>
                Monitor and manage service charge anomalies
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
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
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={thresholdFilter} onValueChange={setThresholdFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Changes</SelectItem>
                  <SelectItem value="high">High (>7%)</SelectItem>
                  <SelectItem value="medium">Medium (5-7%)</SelectItem>
                  <SelectItem value="low">Low (0-5%)</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anomalies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredAnomalies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border-b">Category</th>
                    <th className="text-right p-2 border-b">Previous</th>
                    <th className="text-right p-2 border-b">Current</th>
                    <th className="text-right p-2 border-b">% Change</th>
                    <th className="text-left p-2 border-b">Status</th>
                    <th className="text-left p-2 border-b">Detected</th>
                    <th className="text-right p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnomalies.map((anomaly, index) => (
                    <tr 
                      key={anomaly.id} 
                      className={cn(
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                        'hover:bg-muted transition-colors cursor-pointer'
                      )}
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <td className="p-2 border-b font-medium">{anomaly.category}</td>
                      <td className="text-right p-2 border-b text-muted-foreground">
                        {formatCurrency(anomaly.previousAmount)}
                      </td>
                      <td className="text-right p-2 border-b font-medium">
                        {formatCurrency(anomaly.currentAmount)}
                      </td>
                      <td className={cn("text-right p-2 border-b font-medium", getChangeColor(anomaly.percentageChange))}>
                        {anomaly.percentageChange > 0 ? '+' : ''}{anomaly.percentageChange.toFixed(1)}%
                      </td>
                      <td className="p-2 border-b">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "flex items-center gap-1",
                            getStatusColor(anomaly.status)
                          )}
                        >
                          {getStatusIcon(anomaly.status)}
                          {getStatusText(anomaly.status)}
                        </Badge>
                      </td>
                      <td className="p-2 border-b text-muted-foreground">
                        {new Date(anomaly.detectedAt).toLocaleDateString()}
                      </td>
                      <td className="text-right p-2 border-b">
                        <Dialog>
                          <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="sm">
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Anomaly Status</DialogTitle>
                              <DialogDescription>
                                Change the status and add notes for this service charge anomaly.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Category</Label>
                                <div className="col-span-3 font-medium">
                                  {anomaly.category}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Change</Label>
                                <div className={cn("col-span-3 font-medium", getChangeColor(anomaly.percentageChange))}>
                                  {formatCurrency(anomaly.previousAmount)} → {formatCurrency(anomaly.currentAmount)} 
                                  ({anomaly.percentageChange > 0 ? '+' : ''}{anomaly.percentageChange.toFixed(1)}%)
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select 
                                  defaultValue={anomaly.status}
                                  onValueChange={(value) => {
                                    // Handle status change
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="explained">Explained</SelectItem>
                                    <SelectItem value="requires_action">Requires Action</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                                <Textarea
                                  id="notes"
                                  className="col-span-3"
                                  placeholder="Add notes about this anomaly..."
                                  defaultValue={anomaly.notes}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={(e) => {
                                e.stopPropagation();
                              }}>
                                Cancel
                              </Button>
                              <Button onClick={(e) => {
                                e.stopPropagation();
                                updateAnomalyStatus(anomaly.id, 'under_review', 'Status updated via dialog');
                              }}>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No anomalies found</h3>
              <p className="text-muted-foreground">
                No service charge anomalies match your current filter criteria.
              </p>
              {(statusFilter !== 'all' || categoryFilter !== 'all' || thresholdFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setThresholdFilter('all');
                    setSearchQuery('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
              {filteredAnomalies.length} anomalies found
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm">Low Risk</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Anomaly Detail Dialog */}
      <Dialog open={!!selectedAnomaly} onOpenChange={(open) => !open && setSelectedAnomaly(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Anomaly Details</DialogTitle>
            <DialogDescription>
              Detailed information about the service charge anomaly
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnomaly && (
            <div className="space-y-4">
              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Anomaly Information</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                          <dt className="font-medium">Category:</dt>
                          <dd>{selectedAnomaly.category}</dd>
                          
                          <dt className="font-medium">Previous Amount:</dt>
                          <dd>{formatCurrency(selectedAnomaly.previousAmount)}</dd>
                          
                          <dt className="font-medium">Current Amount:</dt>
                          <dd>{formatCurrency(selectedAnomaly.currentAmount)}</dd>
                          
                          <dt className="font-medium">Percentage Change:</dt>
                          <dd className={getChangeColor(selectedAnomaly.percentageChange)}>
                            {selectedAnomaly.percentageChange > 0 ? '+' : ''}
                            {selectedAnomaly.percentageChange.toFixed(1)}%
                          </dd>
                          
                          <dt className="font-medium">Period:</dt>
                          <dd>
                            {new Date(selectedAnomaly.periodStart).toLocaleDateString()} - 
                            {new Date(selectedAnomaly.periodEnd).toLocaleDateString()}
                          </dd>
                          
                          <dt className="font-medium">Period Type:</dt>
                          <dd className="capitalize">{selectedAnomaly.periodType}</dd>
                          
                          <dt className="font-medium">Detected:</dt>
                          <dd>{new Date(selectedAnomaly.detectedAt).toLocaleString()}</dd>
                          
                          <dt className="font-medium">Status:</dt>
                          <dd>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(selectedAnomaly.status)}
                            >
                              {getStatusText(selectedAnomaly.status)}
                            </Badge>
                          </dd>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        {selectedAnomaly.notes ? (
                          <ScrollArea className="h-[220px]">
                            <p className="text-sm">{selectedAnomaly.notes}</p>
                          </ScrollArea>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                            <Info className="h-8 w-8 mb-2 opacity-40" />
                            <p>No notes have been added yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="actions">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Update Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="detail-status">Status</Label>
                          <Select defaultValue={selectedAnomaly.status}>
                            <SelectTrigger id="detail-status" className="mt-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="explained">Explained</SelectItem>
                              <SelectItem value="requires_action">Requires Action</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="detail-notes">Add Notes</Label>
                          <Textarea 
                            id="detail-notes" 
                            className="mt-1" 
                            placeholder="Add your notes about this anomaly..."
                            defaultValue={selectedAnomaly.notes}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="default" onClick={() => {
                            updateAnomalyStatus(selectedAnomaly.id, 'under_review', 'Status updated from detail view');
                          }}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {/* Mock history items */}
                          <div className="border-l-2 border-blue-500 pl-4 pb-4">
                            <p className="text-sm font-medium">Status changed to {getStatusText(selectedAnomaly.status)}</p>
                            <p className="text-xs text-muted-foreground">2023-03-15 14:30</p>
                            <p className="text-sm mt-1">
                              {selectedAnomaly.notes || 'No notes added with this update'}
                            </p>
                          </div>
                          
                          <div className="border-l-2 border-amber-500 pl-4 pb-4">
                            <p className="text-sm font-medium">Status changed to Under Review</p>
                            <p className="text-xs text-muted-foreground">2023-03-12 10:15</p>
                            <p className="text-sm mt-1">
                              Investigating the reason for the increase.
                            </p>
                          </div>
                          
                          <div className="border-l-2 border-red-500 pl-4">
                            <p className="text-sm font-medium">Anomaly detected</p>
                            <p className="text-xs text-muted-foreground">{new Date(selectedAnomaly.detectedAt).toLocaleString()}</p>
                            <p className="text-sm mt-1">
                              System automatically flagged a {selectedAnomaly.percentageChange.toFixed(1)}% increase
                              in {selectedAnomaly.category}.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAnomaly(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceChargeAnomalies;
