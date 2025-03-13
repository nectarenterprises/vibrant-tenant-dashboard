
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { saveTenantDetails } from '@/services/tenant/TenantService';

interface TenantDialogProps {
  propertyId: string;
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
  onTenantSaved?: () => void;
}

const TenantDialog: React.FC<TenantDialogProps> = ({
  propertyId,
  showTenantDialog,
  setShowTenantDialog,
  tenantName,
  setTenantName,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  onTenantSaved
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTenantDetailsHandler = async () => {
    // Validate required fields
    if (!tenantName.trim()) {
      setError("Tenant name is required");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await saveTenantDetails({
        property_id: propertyId,
        tenant_name: tenantName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone
      });
      
      if (result) {
        toast({
          title: "Tenant details saved",
          description: "The tenant details have been updated successfully.",
        });
        if (onTenantSaved) {
          onTenantSaved();
        }
        setShowTenantDialog(false);
      } else {
        setError("Failed to save tenant details. Please try again.");
      }
    } catch (err) {
      console.error('Error saving tenant details:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="tenantName">Tenant Name <span className="text-red-500">*</span></Label>
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveTenantDetailsHandler}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDialog;
