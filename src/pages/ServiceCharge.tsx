
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Property } from '@/types/property';
import { BarChart3, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceChargeDetails from '@/components/service-charge/ServiceChargeDetails';
import ServiceChargeComparisonDashboard from '@/components/service-charge/ServiceChargeComparisonDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';

const ServiceCharge = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { user } = useAuth();
  const location = useLocation();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: fetchUserProperties,
    enabled: !!user?.id
  });
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle propertyId from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const propertyId = params.get('propertyId');
    
    if (propertyId && properties.length > 0) {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [location.search, properties]);

  const renderTabContent = () => {
    if (!selectedProperty) return null;

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Budget Details</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ServiceChargeDetails property={selectedProperty} />
        </TabsContent>
        
        <TabsContent value="comparison">
          <ServiceChargeComparisonDashboard property={selectedProperty} />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Service Charge</h1>
        
        {!selectedProperty && (
          <PropertySearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
            <PropertyGrid
              filteredProperties={filteredProperties}
              propertiesLoading={propertiesLoading}
              searchQuery={searchQuery}
              onPropertySelect={setSelectedProperty}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCharge;
