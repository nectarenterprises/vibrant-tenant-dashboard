
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DatePickerField from '../form-fields/DatePickerField';
import { toast } from '@/components/ui/use-toast';

interface PropertyDialogProps {
  showPropertyDialog: boolean;
  setShowPropertyDialog: (show: boolean) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  floorArea: string;
  setFloorArea: (area: string) => void;
  yearBuilt: string;
  setYearBuilt: (year: string) => void;
  parkingSpaces: string;
  setParkingSpaces: (spaces: string) => void;
  leaseType: string;
  setLeaseType: (type: string) => void;
  leaseStart: Date | undefined;
  setLeaseStart: (date: Date | undefined) => void;
  leaseDuration: string;
  setLeaseDuration: (duration: string) => void;
  securityDeposit: string;
  setSecurityDeposit: (deposit: string) => void;
}

const PropertyDialog: React.FC<PropertyDialogProps> = ({
  showPropertyDialog,
  setShowPropertyDialog,
  propertyType,
  setPropertyType,
  floorArea,
  setFloorArea,
  yearBuilt,
  setYearBuilt,
  parkingSpaces,
  setParkingSpaces,
  leaseType,
  setLeaseType,
  leaseStart,
  setLeaseStart,
  leaseDuration,
  setLeaseDuration,
  securityDeposit,
  setSecurityDeposit
}) => {
  const savePropertyDetails = () => {
    toast({
      title: "Property details saved",
      description: "The property details have been updated successfully.",
    });
    setShowPropertyDialog(false);
  };

  return (
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
  );
};

export default PropertyDialog;
