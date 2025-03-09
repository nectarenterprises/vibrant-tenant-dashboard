
import React from 'react';
import { Property, Incentive } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, FileText, Users, Building, DollarSign, Clock, Gift, Key, Scissors } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
  const { 
    name, 
    address, 
    rentalFee, 
    nextPaymentDate, 
    leaseExpiry, 
    premisesSchedule, 
    incentives = [] 
  } = property;
  
  // Format dates
  const formattedNextPayment = format(parseISO(nextPaymentDate), 'MMMM d, yyyy');
  const formattedLeaseExpiry = format(parseISO(leaseExpiry), 'MMMM d, yyyy');
  
  // Calculate days until expiry
  const daysUntilExpiry = Math.ceil(
    (new Date(leaseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
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
            {/* Basic Details */}
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
                  <span className="font-medium">${rentalFee.toLocaleString()}</span>
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

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Days Remaining</span>
                  </div>
                  <span className={`font-medium ${daysUntilExpiry < 30 ? 'text-tenant-orange' : ''}`}>
                    {daysUntilExpiry} days
                  </span>
                </div>
              </CardContent>
            </Card>
            
            {/* Tenant Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tenant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-tenant-green" />
                  </div>
                  <div>
                    <p className="font-medium">Acme Corporation</p>
                    <p className="text-sm text-muted-foreground">Primary Tenant</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm">john.smith@acme.com</p>
                  <p className="text-sm">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Documents */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
                    <FileText className="h-5 w-5 text-tenant-green" />
                    <div>
                      <p className="font-medium">Lease Agreement</p>
                      <p className="text-xs text-muted-foreground">Signed on March 1, 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
                    <FileText className="h-5 w-5 text-tenant-green" />
                    <div>
                      <p className="font-medium">Terms & Conditions</p>
                      <p className="text-xs text-muted-foreground">Version 2.1</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
                    <FileText className="h-5 w-5 text-tenant-green" />
                    <div>
                      <p className="font-medium">Insurance Certificate</p>
                      <p className="text-xs text-muted-foreground">Valid until Dec 31, 2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Premises Schedule Section */}
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
          
          {/* Lease Incentives Section */}
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
                            <p className="text-sm mt-1 font-medium">${incentive.value.toLocaleString()}</p>
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
          
          {/* Property Details Section */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Additional information about the property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4 text-tenant-green" />
                      Property Specifications
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Property Type:</span>
                        <span>{name.includes('Office') ? 'Commercial Office' : 'Retail Space'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Floor Area:</span>
                        <span>{name.includes('Office') ? '1,500 sq ft' : '2,200 sq ft'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Year Built:</span>
                        <span>2010</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Parking Spaces:</span>
                        <span>{name.includes('Office') ? '2 Reserved' : '4 Reserved'}</span>
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
                        <span>Full Service</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Lease Start:</span>
                        <span>April 1, 2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Lease Duration:</span>
                        <span>{name.includes('Office') ? '12 months' : '9 months'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Security Deposit:</span>
                        <span>${(rentalFee * 2).toLocaleString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseDetails;
