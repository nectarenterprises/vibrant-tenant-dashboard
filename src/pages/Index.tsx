
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import PropertyCard from '@/components/dashboard/PropertyCard';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import UtilityChart from '@/components/dashboard/UtilityChart';
import { fetchUserProperties, fetchPropertyEvents } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['property-events'],
    queryFn: fetchPropertyEvents,
    enabled: !!user
  });
  
  const uniqueProperties = properties.reduce((acc, current) => {
    const x = acc.find(item => 
      item.name === current.name && 
      item.address === current.address
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
        <p>You need to be logged in to access your properties and dashboard.</p>
      </div>
    );
  }
  
  // Get the user's first name from the user metadata
  const userName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'User';
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <WelcomeHeader userName={userName} />
        
        <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {propertiesLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : uniqueProperties.length === 0 ? (
              <div className="text-center py-10 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground">Add your first property to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {uniqueProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    delay={index}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <CalendarWidget events={events} properties={uniqueProperties} />
          </div>
        </div>
        
        <div className="mt-8">
          <UtilityChart data={[]} properties={uniqueProperties} />
        </div>
      </div>
    </div>
  );
};

export default Index;
