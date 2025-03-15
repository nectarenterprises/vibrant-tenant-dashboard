
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { UtilityChart } from '@/components/dashboard/UtilityChart';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Calendar } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  // Empty state for new users
  if (!loading && properties.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <WelcomeHeader firstName={user?.user_metadata?.first_name || ''} />
        
        <div className="mt-8 flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Welcome to SweetLease!</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Looks like you're new here. Let's get started by adding your first property.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <PlusCircle className="h-8 w-8 text-tenant-green mb-2" />
                </CardTitle>
                <CardTitle>Add Property</CardTitle>
                <CardDescription>Create your first property</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => navigate('/leases')}
                  className="mt-2"
                >
                  Add Property
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <FileText className="h-8 w-8 text-tenant-green mb-2" />
                </CardTitle>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage property documents</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => navigate('/documents')}
                  className="mt-2"
                  variant="outline"
                >
                  Browse Documents
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <Calendar className="h-8 w-8 text-tenant-green mb-2" />
                </CardTitle>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Track important dates</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => navigate('/calendar')}
                  className="mt-2"
                  variant="outline"
                >
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Normal dashboard for users with properties
  return (
    <div className="container mx-auto p-6">
      <WelcomeHeader firstName={user?.user_metadata?.first_name || ''} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="loader"></div>
                  </div>
                ) : (
                  properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
                
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => navigate('/leases')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Utility Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <UtilityChart />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarWidget />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
