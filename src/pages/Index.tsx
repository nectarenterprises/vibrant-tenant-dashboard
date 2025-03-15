
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PropertyCard from '@/components/dashboard/PropertyCard';
import UtilityChart from '@/components/utilities/UtilityChart';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import ComplianceWidget from '@/components/compliance/ComplianceWidget';
import { getProperties } from '@/services/PropertyService';
import { getUtilities } from '@/services/UtilityService';
import { getComplianceItems } from '@/services/ComplianceService';
import { getCalendarEvents } from '@/services/CalendarService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [utilityData, setUtilityData] = useState<any[]>([]);
  const [complianceData, setComplianceData] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasProperties = properties && properties.length > 0;
  const userName = user?.email?.split('@')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const propertiesData = await getProperties();
        setProperties(propertiesData);

        const utilityData = await getUtilities();
        setUtilityData(utilityData);

        const complianceItems = await getComplianceItems();
        setComplianceData(complianceItems);

        const calendarEvents = await getCalendarEvents();
        setCalendarEvents(calendarEvents);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: error.message || "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <WelcomeHeader userName={userName} />
        <div className="dashboard-grid mb-8">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!hasProperties && !isLoading) {
    return (
      <div className="container mx-auto p-6">
        <WelcomeHeader userName={userName} />
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600 mb-4">
            Looks like you haven't added any properties yet.
          </p>
          <Button onClick={() => navigate('/properties/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Property
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <WelcomeHeader userName={userName} />
          <p className="text-slate-500">
            Here's a summary of your SweetLease activity.
          </p>
        </div>
        <Button onClick={() => navigate('/properties/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>
      
      <div className="dashboard-grid mb-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        
        <UtilityChart data={utilityData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarWidget events={calendarEvents} />
        <ComplianceWidget complianceItems={complianceData} />
      </div>
    </div>
  );
};

export default Index;
