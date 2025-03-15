
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, Search, File, Clock, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceChargeQueriesProps {
  property: Property;
}

const mockQueries = [
  {
    id: '1',
    title: 'Unusually high cleaning costs',
    description: 'The cleaning costs for Q2 2023 are 35% higher than the previous quarter with no explanation.',
    status: 'new',
    responsibleParty: 'Property Manager',
    expectedResponseDate: '2023-06-15',
    potentialValue: 2500,
    createdAt: '2023-05-28',
    category: 'Cleaning',
  },
  {
    id: '2',
    title: 'Security charge increase',
    description: 'Security charges have increased despite reduction in on-site security personnel.',
    status: 'in_progress',
    responsibleParty: 'Building Management',
    expectedResponseDate: '2023-06-20',
    potentialValue: 1800,
    createdAt: '2023-05-30',
    category: 'Security',
  },
  {
    id: '3',
    title: 'Duplicate administration fees',
    description: 'Administration fees appear to be charged twice in the March 2023 statement.',
    status: 'awaiting_response',
    responsibleParty: 'Accounts Department',
    expectedResponseDate: '2023-06-10',
    potentialValue: 950,
    createdAt: '2023-06-01',
    category: 'Management Fee',
  },
  {
    id: '4',
    title: 'HVAC maintenance overcharge',
    description: 'The quarterly HVAC maintenance charge is higher than the contracted rate.',
    status: 'resolved',
    responsibleParty: 'Maintenance Contractor',
    expectedResponseDate: '2023-05-25',
    potentialValue: 1200,
    createdAt: '2023-05-15',
    category: 'Maintenance',
  },
];

const ServiceChargeQueries: React.FC<ServiceChargeQueriesProps> = ({ property }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewQueryDialogOpen, setIsNewQueryDialogOpen] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">In Progress</Badge>;
      case 'awaiting_response':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Awaiting Response</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'awaiting_response':
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'closed':
        return <CheckCircle2 className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };
  
  const filteredQueries = mockQueries.filter(query => {
    const matchesFilter = filter === 'all' || query.status === filter;
    const matchesSearch = 
      query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">{property.name} - Service Charge Queries</CardTitle>
              <CardDescription>Manage and track service charge queries and disputes</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Dialog open={isNewQueryDialogOpen} onOpenChange={setIsNewQueryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> New Query
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Service Charge Query</DialogTitle>
                    <DialogDescription>
                      Log a new service charge query for investigation and resolution.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="query-title">Title</Label>
                      <Input id="query-title" placeholder="Briefly describe the issue" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="query-category">Category</Label>
                        <Select>
                          <SelectTrigger id="query-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="management">Management Fee</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="potential-value">Potential Value (£)</Label>
                        <Input id="potential-value" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="query-description">Description</Label>
                      <Textarea 
                        id="query-description" 
                        placeholder="Provide details about the query, including dates, amounts, and any supporting information"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="responsible-party">Responsible Party</Label>
                        <Input id="responsible-party" placeholder="Who should respond to this query?" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expected-response-date">Expected Response Date</Label>
                        <div className="relative">
                          <Input id="expected-response-date" type="date" />
                          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Attachments</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here, or click to select files
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewQueryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsNewQueryDialogOpen(false)}>Create Query</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
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
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="awaiting_response">Awaiting Response</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredQueries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Response By</TableHead>
                    <TableHead className="text-right">Potential Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusIcon(query.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{query.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {query.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created: {query.createdAt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{query.category}</TableCell>
                      <TableCell>
                        <div>
                          <div>{query.responsibleParty}</div>
                          <div className="text-xs text-muted-foreground">
                            Expected: {query.expectedResponseDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {query.potentialValue ? `£${query.potentialValue.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getStatusBadge(query.status)}
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-1">No queries found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No queries match "${searchQuery}"`
                  : "Start by creating a new service charge query"
                }
              </p>
              <Button onClick={() => setIsNewQueryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create New Query
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredQueries.length} of {mockQueries.length} queries
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={filteredQueries.length === 0}>
              Export
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceChargeQueries;
