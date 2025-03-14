
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText } from 'lucide-react';

const ServiceDetailsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
        <CardDescription>Information about included services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
            <Building className="h-5 w-5 text-tenant-green" />
            <div>
              <p className="font-medium">Maintenance & Repairs</p>
              <p className="text-sm text-muted-foreground">
                Includes common area maintenance, equipment servicing, 
                and repairs to building systems.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-tenant-green"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-1.461c1.99-1.368 3.258-3.407 3.253-5.645 0-2.228-1.29-4.312-3.28-5.676 0 0-1.36 1.453-3.286 1.512v-.001c-1.906.001-3.197-1.517-3.197-1.517s-1.29 1.518-3.192 1.518c-1.89 0-3.177-1.432-3.177-1.432-1.99 1.362-3.262 3.403-3.262 5.631 0 1.736.78 3.342 2.078 4.596.5.486 1.039.938 1.617 1.34" />
              <path d="M12.975 7.938c.521-.302.121-.58-.168-.892s-.679-.409-1.25 0c-.57.41-1.198.892-1.198.892a1.434 1.434 0 0 0-.2 2.027l1.974 2.46c.245.305.643.486 1.058.486h.277c.019-.87.057-.738.152-.738s.35.3.35.3" />
            </svg>
            <div>
              <p className="font-medium">Insurance</p>
              <p className="text-sm text-muted-foreground">
                Property insurance for common areas and building structure.
                Tenant responsible for contents insurance.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
            <FileText className="h-5 w-5 text-tenant-green" />
            <div>
              <p className="font-medium">Management Fee</p>
              <p className="text-sm text-muted-foreground">
                Professional property management services including
                administration and accounting.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm">
            For a complete breakdown of all service charges, please view the 
            <span className="text-tenant-green font-medium cursor-pointer ml-1">
              service charge schedule
            </span>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDetailsCard;
