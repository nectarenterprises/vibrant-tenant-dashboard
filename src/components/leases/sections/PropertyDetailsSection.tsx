
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, FileText, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface PropertyDetailsSectionProps {
  propertyType: string;
  floorArea: string;
  yearBuilt: string;
  parkingSpaces: string;
  leaseType: string;
  leaseStart: Date | undefined;
  leaseDuration: string;
  securityDeposit: string;
  setShowPropertyDialog: (show: boolean) => void;
}

const PropertyDetailsSection = ({
  propertyType,
  floorArea,
  yearBuilt,
  parkingSpaces,
  leaseType,
  leaseStart,
  leaseDuration,
  securityDeposit,
  setShowPropertyDialog
}: PropertyDetailsSectionProps) => {
  return (
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
  );
};

export default PropertyDetailsSection;
