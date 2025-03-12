
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Edit, Plus } from 'lucide-react';

interface TenantDetailsProps {
  tenantName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  setShowTenantDialog: (show: boolean) => void;
}

const TenantDetails = ({ 
  tenantName, 
  contactName, 
  contactEmail, 
  contactPhone, 
  setShowTenantDialog 
}: TenantDetailsProps) => {
  return (
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
  );
};

export default TenantDetails;
