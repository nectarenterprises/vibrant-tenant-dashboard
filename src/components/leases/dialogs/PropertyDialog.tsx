
// This is a new file that updates the PropertyDialog to save details to the database
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import DatePickerField from '../form-fields/DatePickerField';
import { savePropertyDetails, PropertyDetailsInput } from '@/services/property/PropertyDetailsService';

interface PropertyDialogProps {
  showPropertyDialog: boolean;
  setShowPropertyDialog: (show: boolean) => void;
  propertyId: string;
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
  propertyId,
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
  const [localPropertyType, setLocalPropertyType] = useState(propertyType);
  const [localFloorArea, setLocalFloorArea] = useState(floorArea);
  const [localYearBuilt, setLocalYearBuilt] = useState(yearBuilt);
  const [localParkingSpaces, setLocalParkingSpaces] = useState(parkingSpaces);
  const [localLeaseType, setLocalLeaseType] = useState(leaseType);
  const [localLeaseStart, setLocalLeaseStart] = useState<Date | undefined>(leaseStart);
  const [localLeaseDuration, setLocalLeaseDuration] = useState(leaseDuration);
  const [localSecurityDeposit, setLocalSecurityDeposit] = useState(securityDeposit);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const propertyDetailsInput: PropertyDetailsInput = {
        property_id: propertyId,
        property_type: localPropertyType,
        floor_area: localFloorArea,
        year_built: localYearBuilt,
        parking_spaces: localParkingSpaces,
        lease_type: localLeaseType,
        lease_start: localLeaseStart ? localLeaseStart.toISOString() : undefined,
        lease_duration: localLeaseDuration,
        security_deposit: localSecurityDeposit
      };
      
      const success = await savePropertyDetails(propertyDetailsInput);
      
      if (success) {
        // Update the parent component state
        setPropertyType(localPropertyType);
        setFloorArea(localFloorArea);
        setYearBuilt(localYearBuilt);
        setParkingSpaces(localParkingSpaces);
        setLeaseType(localLeaseType);
        setLeaseStart(localLeaseStart);
        setLeaseDuration(localLeaseDuration);
        setSecurityDeposit(localSecurityDeposit);
        
        setShowPropertyDialog(false);
      }
    } catch (error) {
      console.error('Error saving property details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save property details. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset local state
    setLocalPropertyType(propertyType);
    setLocalFloorArea(floorArea);
    setLocalYearBuilt(yearBuilt);
    setLocalParkingSpaces(parkingSpaces);
    setLocalLeaseType(leaseType);
    setLocalLeaseStart(leaseStart);
    setLocalLeaseDuration(leaseDuration);
    setLocalSecurityDeposit(securityDeposit);
    
    setShowPropertyDialog(false);
  };

  return (
    <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{propertyType ? 'Edit' : 'Add'} Property Details</DialogTitle>
          <DialogDescription>
            Enter additional details about the property.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                value={localPropertyType}
                onChange={(e) => setLocalPropertyType(e.target.value)}
                placeholder="e.g. Office, Retail, Warehouse"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floorArea">Floor Area</Label>
              <Input
                id="floorArea"
                value={localFloorArea}
                onChange={(e) => setLocalFloorArea(e.target.value)}
                placeholder="e.g. 1,500 sq ft"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                value={localYearBuilt}
                onChange={(e) => setLocalYearBuilt(e.target.value)}
                placeholder="e.g. 2010"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Parking Spaces</Label>
              <Input
                id="parkingSpaces"
                value={localParkingSpaces}
                onChange={(e) => setLocalParkingSpaces(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseType">Lease Type</Label>
              <Input
                id="leaseType"
                value={localLeaseType}
                onChange={(e) => setLocalLeaseType(e.target.value)}
                placeholder="e.g. FRI, IRI"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaseStart">Lease Start Date</Label>
              <DatePickerField
                date={localLeaseStart}
                setDate={setLocalLeaseStart}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseDuration">Lease Duration</Label>
              <Input
                id="leaseDuration"
                value={localLeaseDuration}
                onChange={(e) => setLocalLeaseDuration(e.target.value)}
                placeholder="e.g. 5 years"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit</Label>
              <Input
                id="securityDeposit"
                value={localSecurityDeposit}
                onChange={(e) => setLocalSecurityDeposit(e.target.value)}
                placeholder="e.g. £10,000"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Details'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDialog;
