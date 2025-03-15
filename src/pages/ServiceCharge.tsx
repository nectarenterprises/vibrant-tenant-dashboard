import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { Search, BarChart3, PieChart, AlertTriangle, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceChargeDetails from '@/components/service-charge/ServiceChargeDetails';
import ServiceChargeComparisonDashboard from '@/components/service-charge/ServiceChargeComparisonDashboard';
import ServiceChargeAnomalies from '@/components/service-charge/ServiceChargeAnomalies';
import ServiceChargeQueries from '@/components/service-charge/ServiceChargeQueries';
import ServiceChargeCategoryBreakdown from '@/components/service-charge/ServiceChargeCategoryBreakdown';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';

const ServiceCharge = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { user } = useAuth();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: fetchUserProperties,
    enabled: !!user?.id
  });
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    if (!selectedProperty) return null;

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Anomalies</span>
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Queries</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ServiceChargeDetails property={selectedProperty} />
        </TabsContent>
        
        <TabsContent value="comparison">
          <ServiceChargeComparisonDashboard property={selectedProperty} />
        </TabsContent>
        
        <TabsContent value="categories">
          <ServiceChargeCategoryBreakdown property={selectedProperty} />
        </TabsContent>
        
        <TabsContent value="anomalies">
          <ServiceChargeAnomalies property={selectedProperty} />
        </TabsContent>
        
        <TabsContent value="queries">
          <ServiceChargeQueries property={selectedProperty} />
        </TabsContent>
      </Tabs>
    );
  };

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
          <h1 className="text-3xl font-bold mb-6">Service Charge</h1>
          
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
                ← Back to all properties
              </button>
              {renderTabContent()}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Loading properties...</p>
                </div>
              ) : filteredProperties.length > 0 ? (
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

export default ServiceCharge;
