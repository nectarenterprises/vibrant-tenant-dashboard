
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LeaseDetailsContainer from '@/components/leases/LeaseDetailsContainer';
import AddPropertyDialog from '@/components/leases/AddPropertyDialog';
import { fetchUserProperties } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';

const Leases = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  // Check for propertyId in URL parameters when properties are loaded
  useEffect(() => {
    if (!isLoading && properties.length > 0) {
      const propertyId = searchParams.get('propertyId');
      if (propertyId) {
        const property = properties.find(p => p.id === propertyId);
        if (property) {
          setSelectedProperty(property);
        }
      }
    }
  }, [properties, isLoading, searchParams]);
  
  const filteredProperties = properties
    .reduce((acc: Property[], current) => {
      const x = acc.find(item => 
        item.name === current.name && 
        item.address === current.address
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .filter(property => 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your leases</h1>
        <p>You need to be logged in to access your property leases.</p>
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Leases</h1>
            
            {!selectedProperty && (
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Add Property
              </Button>
            )}
          </div>
          
          {!selectedProperty && (
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
          )}

          {selectedProperty ? (
            <div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
              >
                ← Back to all leases
              </button>
              <LeaseDetailsContainer property={selectedProperty} />
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
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
                  ))}
                </div>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  {searchQuery ? (
                    <p>No properties found matching "{searchQuery}"</p>
                  ) : (
                    <div className="text-center">
                      <p className="mb-4">No properties found</p>
                      <Button 
                        onClick={() => setShowAddDialog(true)}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-5 w-5" />
                        Add Your First Property
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <AddPropertyDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default Leases;
