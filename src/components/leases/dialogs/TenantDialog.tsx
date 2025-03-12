
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface TenantDialogProps {
  showTenantDialog: boolean;
  setShowTenantDialog: (show: boolean) => void;
  tenantName: string;
  setTenantName: (name: string) => void;
  contactName: string;
  setContactName: (name: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
  contactPhone: string;
  setContactPhone: (phone: string) => void;
}

const TenantDialog: React.FC<TenantDialogProps> = ({
  showTenantDialog,
  setShowTenantDialog,
  tenantName,
  setTenantName,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone
}) => {
  const saveTenantDetails = () => {
    toast({
      title: "Tenant details saved",
      description: "The tenant details have been updated successfully.",
    });
    setShowTenantDialog(false);
  };

  return (
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
  );
};

export default TenantDialog;
