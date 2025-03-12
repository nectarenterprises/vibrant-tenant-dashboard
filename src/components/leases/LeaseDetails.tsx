import React, { useState } from 'react';
import { Property, Incentive, DocumentType } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  FileText, 
  Users, 
  Building, 
  DollarSign, 
  Clock, 
  Gift, 
  Key, 
  Scissors,
  Edit,
  Plus,
  Upload
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePickerField from './form-fields/DatePickerField';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface LeaseDetailsProps {
  property: Property;
}

const IncentiveIcon = ({ type }: { type: Incentive['type'] }) => {
  switch (type) {
    case 'rent-free':
      return <Gift className="h-4 w-4 text-tenant-green" />;
    case 'fitout':
      return <Building className="h-4 w-4 text-tenant-green" />;
    case 'break-option':
      return <Scissors className="h-4 w-4 text-tenant-green" />;
    default:
      return <DollarSign className="h-4 w-4 text-tenant-green" />;
  }
};

const LeaseDetails: React.FC<LeaseDetailsProps> = ({ property }) => {
  const [propertyType, setPropertyType] = useState<string>('');
  const [floorArea, setFloorArea] = useState<string>('');
  const [yearBuilt, setYearBuilt] = useState<string>('');
  const [parkingSpaces, setParkingSpaces] = useState<string>('');
  
  const [leaseType, setLeaseType] = useState<string>('');
  const [leaseStart, setLeaseStart] = useState<Date | undefined>(undefined);
  const [leaseDuration, setLeaseDuration] = useState<string>('');
  const [securityDeposit, setSecurityDeposit] = useState<string>('');
  
  const [tenantName, setTenantName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showLeaseDialog, setShowLeaseDialog] = useState(false);
  const [showTenantDialog, setShowTenantDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('lease');
  const [documentName, setDocumentName] = useState('');
  
  const { 
    name, 
    address, 
    rentalFee, 
    nextPaymentDate, 
    leaseExpiry, 
    premisesSchedule, 
    incentives = [] 
  } = property;
  
  const formattedNextPayment = nextPaymentDate ? format(parseISO(nextPaymentDate), 'MMMM d, yyyy') : 'Not set';
  const formattedLeaseExpiry = leaseExpiry ? format(parseISO(leaseExpiry), 'MMMM d, yyyy') : 'Not set';
  
  const daysUntilExpiry = leaseExpiry 
    ? Math.ceil((new Date(leaseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!documentName) {
        setDocumentName(e.target.files[0].name);
      }
    }
  };
  
  const handleDocumentUpload = () => {
    toast({
      title: "Document uploaded",
      description: `${documentName} has been uploaded successfully.`,
    });
    setShowDocumentDialog(false);
    setSelectedFile(null);
    setDocumentName('');
    setDocumentType('lease');
  };
  
  const savePropertyDetails = () => {
    toast({
      title: "Property details saved",
      description: "The property details have been updated successfully.",
    });
    setShowPropertyDialog(false);
  };
  
  const saveLeaseTerms = () => {
    toast({
      title: "Lease terms saved",
      description: "The lease terms have been updated successfully.",
    });
    setShowLeaseDialog(false);
  };
  
  const saveTenantDetails = () => {
    toast({
      title: "Tenant details saved",
      description: "The tenant details have been updated successfully.",
    });
    setShowTenantDialog(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="h-48 mellow-gradient relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white font-bold text-2xl">{name}</h2>
            <p className="text-white/90">{address}</p>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lease Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Monthly Rent</span>
                  </div>
                  <span className="font-medium">£{rentalFee.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Next Payment</span>
                  </div>
                  <span className="font-medium">{formattedNextPayment}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Lease Expiry</span>
                  </div>
                  <span className="font-medium">{formattedLeaseExpiry}</span>
                </div>

                {leaseExpiry && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-tenant-green" />
                      <span className="text-muted-foreground">Days Remaining</span>
                    </div>
                    <span className={`font-medium ${daysUntilExpiry < 30 ? 'text-tenant-orange' : ''}`}>
                      {daysUntilExpiry} days
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Tenant Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowTenantDialog(true)}
                >
                  {tenantName ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenantName ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-tenant-green" />
                      </div>
                      <div>
                        <p className="font-medium">{tenantName}</p>
                        <p className="text-sm text-muted-foreground">Primary Tenant</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                      <p className="font-medium">{contactName}</p>
                      <p className="text-sm">{contactEmail}</p>
                      <p className="text-sm">{contactPhone}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Users className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No tenant details added</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setShowTenantDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tenant Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Documents</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowDocumentDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No documents uploaded</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setShowDocumentDialog(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>Additional information about the property</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPropertyDialog(true)}
                >
                  {propertyType ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {propertyType ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4 text-tenant-green" />
                        Property Specifications
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Property Type:</span>
                          <span>{propertyType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Floor Area:</span>
                          <span>{floorArea}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Year Built:</span>
                          <span>{yearBuilt}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Parking Spaces:</span>
                          <span>{parkingSpaces}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-tenant-green" />
                        Lease Terms
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Lease Type:</span>
                          <span>{leaseType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Lease Start:</span>
                          <span>{leaseStart ? format(leaseStart, 'MMMM d, yyyy') : 'Not set'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Lease Duration:</span>
                          <span>{leaseDuration}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Security Deposit:</span>
                          <span>{securityDeposit}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Building className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No property details added</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setShowPropertyDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Property Details</DialogTitle>
                <DialogDescription>
                  Add or update property specifications and lease terms.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      value={propertyType}
                      onValueChange={setPropertyType}
                    >
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="floorArea">Floor Area (sq m)</Label>
                    <Input
                      id="floorArea"
                      value={floorArea}
                      onChange={(e) => setFloorArea(e.target.value)}
                      placeholder="e.g. 150"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="e.g. 2010"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                    <Input
                      id="parkingSpaces"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(e.target.value)}
                      placeholder="e.g. 2 Reserved"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2 mt-4">
                  <h3 className="text-sm font-medium">Lease Terms</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="leaseType">Lease Type</Label>
                    <Select
                      value={leaseType}
                      onValueChange={setLeaseType}
                    >
                      <SelectTrigger id="leaseType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Service">Full Service</SelectItem>
                        <SelectItem value="Triple Net">Triple Net</SelectItem>
                        <SelectItem value="Modified Gross">Modified Gross</SelectItem>
                        <SelectItem value="Gross">Gross</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Lease Start Date</Label>
                    <DatePickerField
                      label=""
                      selected={leaseStart}
                      onSelect={setLeaseStart}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="leaseDuration">Lease Duration</Label>
                    <Select
                      value={leaseDuration}
                      onValueChange={setLeaseDuration}
                    >
                      <SelectTrigger id="leaseDuration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="12 months">12 months</SelectItem>
                        <SelectItem value="24 months">24 months</SelectItem>
                        <SelectItem value="36 months">36 months</SelectItem>
                        <SelectItem value="60 months">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="securityDeposit">Security Deposit (£)</Label>
                    <Input
                      id="securityDeposit"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPropertyDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={savePropertyDetails}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showTenantDialog} onOpenChange={setShowTenantDialog}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Tenant Details</DialogTitle>
                <DialogDescription>
                  Add or update tenant information for this property.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tenantName">Tenant Name</Label>
                  <Input
                    id="tenantName"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Smith"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. john@acme.com"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. (020) 7123 4567"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTenantDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveTenantDetails}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document related to this property lease.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select
                    value={documentType}
                    onValueChange={(value) => setDocumentType(value as DocumentType)}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lease">Lease Agreement</SelectItem>
                      <SelectItem value="utility">Utility Bill</SelectItem>
                      <SelectItem value="compliance">Compliance Document</SelectItem>
                      <SelectItem value="service-charge">Service Charge Statement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="e.g. Lease Agreement 2023"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="documentFile">File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mb-4">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          Change file
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to upload</p>
                        <Input
                          id="documentFile"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('documentFile')?.click()}
                        >
                          Select File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDocumentDialog(false);
                    setSelectedFile(null);
                    setDocumentName('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDocumentUpload}
                  disabled={!selectedFile || !documentName || !documentType}
                >
                  Upload Document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Premises Schedule</CardTitle>
                <CardDescription>Definition of the tenant's demise</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                {premisesSchedule ? (
                  <div className="bg-muted p-4 rounded-md">
                    <p>{premisesSchedule}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No premises schedule defined</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lease Incentives</CardTitle>
                <CardDescription>Special terms and benefits included in the lease</CardDescription>
              </CardHeader>
              <CardContent>
                {incentives && incentives.length > 0 ? (
                  <div className="space-y-4">
                    {incentives.map((incentive, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-md">
                        <div className="h-8 w-8 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center mt-1">
                          <IncentiveIcon type={incentive.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">
                              {incentive.type === 'rent-free' ? 'Rent Free Period' :
                               incentive.type === 'fitout' ? 'Fitout Contribution' :
                               incentive.type === 'break-option' ? 'Break Option' : 
                               'Other Incentive'}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {incentive.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm">{incentive.description}</p>
                          {incentive.value && (
                            <p className="text-sm mt-1 font-medium">£{incentive.value.toLocaleString()}</p>
                          )}
                          {incentive.period && (
                            <p className="text-sm text-muted-foreground">{incentive.period}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No incentives defined for this lease</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseDetails;
