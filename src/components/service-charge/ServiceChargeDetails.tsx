
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, FileText, Banknote, PieChart, ArrowUpDown, Building } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ServiceChargeDetailsProps {
  property: Property;
}

const ServiceChargeDetails: React.FC<ServiceChargeDetailsProps> = ({ property }) => {
  const { name, address, rentalFee } = property;
  
  // Mock service charge data
  const serviceCharges = [
    { category: 'Maintenance', amount: rentalFee * 0.15, percentage: 15 },
    { category: 'Security', amount: rentalFee * 0.1, percentage: 10 },
    { category: 'Cleaning', amount: rentalFee * 0.08, percentage: 8 },
    { category: 'Utilities', amount: rentalFee * 0.12, percentage: 12 },
    { category: 'Insurance', amount: rentalFee * 0.05, percentage: 5 },
    { category: 'Management Fee', amount: rentalFee * 0.06, percentage: 6 },
  ];
  
  const totalServiceCharge = serviceCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const nextBillingDate = format(new Date(new Date().setDate(1)), 'MMMM d, yyyy');
  
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
            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Service Charge Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Total Monthly</span>
                  </div>
                  <span className="font-medium">${totalServiceCharge.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">% of Rent</span>
                  </div>
                  <span className="font-medium">{((totalServiceCharge / rentalFee) * 100).toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Next Billing</span>
                  </div>
                  <span className="font-medium">{nextBillingDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-tenant-green" />
                    <span className="text-muted-foreground">Categories</span>
                  </div>
                  <span className="font-medium">{serviceCharges.length}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Breakdown Chart */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Charge Breakdown</CardTitle>
                <CardDescription>Monthly service charge by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceCharges.map((charge) => (
                    <div key={charge.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{charge.category}</span>
                        <span className="font-medium">${charge.amount.toFixed(2)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tenant-green"
                          style={{ width: `${charge.percentage * 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Last 6 months of service charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    const monthName = format(date, 'MMMM yyyy');
                    // Add a small random variation to the total
                    const variation = (Math.random() * 0.1 - 0.05) * totalServiceCharge;
                    const monthlyTotal = totalServiceCharge + variation;
                    
                    return (
                      <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-tenant-lightGreen/20 flex items-center justify-center">
                            <CalendarIcon className="h-4 w-4 text-tenant-green" />
                          </div>
                          <span>{monthName}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${monthlyTotal.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {monthlyTotal > totalServiceCharge ? '↑' : '↓'} 
                            {Math.abs(((monthlyTotal / totalServiceCharge) - 1) * 100).toFixed(1)}% 
                            from average
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeDetails;
