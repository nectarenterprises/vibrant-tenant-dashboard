
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import LeaseDetails from '@/components/leases/LeaseDetails';

// Mock data - using the same properties from the dashboard but with additional fields
const mockProperties: Property[] = [
  {
    id: '1',
    name: '123 Main Office',
    address: '123 Main St, Suite 101, San Francisco, CA',
    rentalFee: 2500,
    nextPaymentDate: '2023-04-15',
    leaseExpiry: '2024-03-31',
    premisesSchedule: 'The demised premises consists of Suite 101 located on the first floor of the building known as 123 Main St, San Francisco, CA, with a total rentable area of 1,500 square feet. The premises includes access to common areas including lobbies, elevators, stairways, and restrooms. Tenant has exclusive use of 2 reserved parking spaces located in the underground parking garage.',
    incentives: [
      {
        type: 'rent-free',
        description: 'First month rent-free upon lease commencement',
        value: 2500,
        period: '1 month'
      },
      {
        type: 'fitout',
        description: 'Contribution towards office fit-out and customization',
        value: 10000,
        period: 'One-time payment'
      },
      {
        type: 'break-option',
        description: 'Option to terminate lease after 6 months with 60 days notice',
        period: 'After 6 months'
      }
    ]
  },
  {
    id: '2',
    name: 'Downtown Retail',
    address: '456 Market St, San Francisco, CA',
    rentalFee: 3200,
    nextPaymentDate: '2023-04-10',
    leaseExpiry: '2023-12-31',
    premisesSchedule: 'The premises consists of a ground floor retail unit with approximately 2,200 square feet of usable space at 456 Market St, San Francisco, CA. The unit includes a main retail area, storage room, and staff facilities. Tenant has access to the service corridor at the rear of the building for deliveries and waste disposal. The premises includes the right to install and maintain signage on the building façade subject to landlord approval and local regulations.',
    incentives: [
      {
        type: 'rent-free',
        description: 'Three months rent-free period',
        value: 9600,
        period: '3 months'
      },
      {
        type: 'other',
        description: 'Reduced service charge in year one (50% discount)',
        value: 4800,
        period: '12 months'
      }
    ]
  }
];

const Leases = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Filter properties based on search query
  const filteredProperties = mockProperties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Leases</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedProperty ? (
            <div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
              >
                ← Back to all leases
              </button>
              <LeaseDetails property={selectedProperty} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <div 
                    key={property.id} 
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <PropertyCard 
                      property={property} 
                      delay={index} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p>No properties found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leases;
