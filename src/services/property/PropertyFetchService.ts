import { supabase } from '@/integrations/supabase/client';
import { Property, EventData, Incentive } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { getPropertyImageUrl } from './PropertyImageService';

/**
 * Fetches all properties for the current authenticated user
 */
export const fetchUserProperties = async (): Promise<Property[]> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to view properties",
      });
      return [];
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch properties",
        description: error.message,
      });
      return [];
    }
    
    // Transform to frontend model
    const transformedProperties = data.map(property => ({
      id: property.id,
      name: property.name,
      address: property.address,
      rentalFee: Number(property.rental_fee),
      nextPaymentDate: property.next_payment_date,
      leaseExpiry: property.lease_expiry,
      premisesSchedule: property.premises_schedule || '',
      incentives: parseIncentives(property.incentives),
      createdAt: property.created_at,
      updatedAt: property.updated_at,
      image: property.image_path ? getPropertyImageUrl(property.image_path) : undefined
    }));
    
    // Remove any duplicates based on id
    const uniqueProperties = transformedProperties.reduce((acc: Property[], current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    
    return uniqueProperties;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch properties",
      description: error.message || "An error occurred while fetching properties",
    });
    return [];
  }
};

/**
 * Parse the incentives from JSON to Incentive array
 */
const parseIncentives = (incentivesJson: any): Incentive[] => {
  if (!incentivesJson) return [];
  
  try {
    // If it's already a string, parse it
    if (typeof incentivesJson === 'string') {
      return JSON.parse(incentivesJson);
    }
    // If it's already an array, return it
    if (Array.isArray(incentivesJson)) {
      return incentivesJson;
    }
    return [];
  } catch (e) {
    console.error('Error parsing incentives:', e);
    return [];
  }
};

/**
 * Fetches property events (placeholder for now - would be expanded in a real implementation)
 */
export const fetchPropertyEvents = async (): Promise<EventData[]> => {
  // This would normally fetch events from the database
  // For now, we'll use mock data similar to what was in Index.tsx
  return [
    {
      id: '1',
      title: 'Rent Due',
      date: '2023-04-15',
      type: 'rent',
      propertyId: '1',
      propertyName: 'Victoria Office'
    },
    {
      id: '2',
      title: 'Quarterly Inspection',
      date: '2023-04-20',
      type: 'inspection',
      propertyId: '2',
      propertyName: 'Covent Garden Retail'
    },
    {
      id: '3',
      title: 'HVAC Maintenance',
      date: '2023-04-25',
      type: 'maintenance',
      propertyId: '1',
      propertyName: 'Victoria Office'
    }
  ];
};
