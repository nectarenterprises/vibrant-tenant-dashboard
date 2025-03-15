
import React from 'react';
import { Property } from '@/types/property';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, CalendarDays, Banknote, UserRound, FileText } from 'lucide-react';

interface PropertySummaryReportProps {
  property: Property;
}

const PropertySummaryReport: React.FC<PropertySummaryReportProps> = ({ property }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Summary Report</h1>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <div className="text-right">
          <h2 className="font-medium">{property.name}</h2>
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Property Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{property.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Property ID</p>
                <p className="font-medium">{property.id.substring(0, 8)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lease Start</p>
                <p className="font-medium">{property.leaseExpiry ? formatDate(property.leaseExpiry) : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lease Expiry</p>
                <p className="font-medium">{property.leaseExpiry ? formatDate(property.leaseExpiry) : 'N/A'}</p>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rental Fee</p>
                <p className="font-medium">{formatCurrency(property.rentalFee)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Service Charge</p>
                <p className="font-medium">{formatCurrency(property.serviceChargeAmount || 0)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <p className="font-medium">{property.nextPaymentDate ? formatDate(property.nextPaymentDate) : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Annual Cost</p>
                <p className="font-medium">{formatCurrency((property.rentalFee + (property.serviceChargeAmount || 0)) * 12)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Key Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lease Expiry</p>
                  <p className="font-medium">{property.leaseExpiry ? formatDate(property.leaseExpiry) : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Next Payment</p>
                  <p className="font-medium">{property.nextPaymentDate ? formatDate(property.nextPaymentDate) : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(property.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(property.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Documents Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lease Documents</p>
                  <p className="font-medium">2</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Compliance Documents</p>
                  <p className="font-medium">3</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Financial Documents</p>
                  <p className="font-medium">4</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Other Documents</p>
                  <p className="font-medium">1</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tenant Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tenant Name</p>
                <p className="font-medium">Acme Corporation</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">John Smith</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p className="font-medium">john.smith@acme.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Phone</p>
                <p className="font-medium">+44 123 456 7890</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lease Status</p>
                <p className="font-medium">Active</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tenant Since</p>
                <p className="font-medium">January 2022</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySummaryReport;
