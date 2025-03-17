import { supabase } from '@/integrations/supabase/client';
import { Property, EventData, UtilityData, Incentive } from '@/types/property';
import { getPropertyImageUrl } from './PropertyImageService';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetches all properties for the current authenticated user
 */
export const fetchUserProperties = async (): Promise<Property[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
    return data.map(property => {
      // Parse incentives field to get metadata
      let incentives: Incentive[] = [];
      let serviceChargeAmount = 0;
      let utilityData: UtilityData[] = [];
      
      try {
        const incentivesData = property.incentives;
        if (incentivesData) {
          // Check if the incentives field is a string or an object
          const parsedData = typeof incentivesData === 'string' 
            ? JSON.parse(incentivesData) 
            : incentivesData;
          
          // If it's an array, treat it as incentives
          if (Array.isArray(parsedData)) {
            incentives = parsedData as Incentive[];
          } 
          // Otherwise, it might be our metadata object
          else if (typeof parsedData === 'object') {
            serviceChargeAmount = parsedData.service_charge_amount || 0;
            utilityData = parsedData.utility_data || [];
            // There might still be incentives in there
            if (parsedData.incentives && Array.isArray(parsedData.incentives)) {
              incentives = parsedData.incentives;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing incentives data:", e);
      }
      
      return {
        id: property.id,
        name: property.name,
        address: property.address,
        rentalFee: Number(property.rental_fee),
        nextPaymentDate: property.next_payment_date,
        leaseExpiry: property.lease_expiry,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
        image: property.image_path ? getPropertyImageUrl(property.image_path) : undefined,
        premisesSchedule: property.premises_schedule || '',
        incentives,
        serviceChargeAmount,
        utilityData
      };
    });
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
 * Fetches property events for the calendar
 */
export const fetchPropertyEvents = async (): Promise<EventData[]> => {
  try {
    const properties = await fetchUserProperties();
    
    if (properties.length === 0) {
      return [];
    }
    
    const events: EventData[] = [];
    
    // Add rent payment events
    properties.forEach(property => {
      // Rent payment events
      events.push({
        id: uuidv4(),
        title: `Rent payment due: ${property.name}`,
        date: property.nextPaymentDate,
        type: 'rent',
        propertyId: property.id,
        propertyName: property.name
      });
      
      // Lease expiry events
      events.push({
        id: uuidv4(),
        title: `Lease expires: ${property.name}`,
        date: property.leaseExpiry,
        type: 'other',
        propertyId: property.id,
        propertyName: property.name
      });
      
      // Add a maintenance inspection event
      const maintenanceDate = new Date();
      maintenanceDate.setMonth(maintenanceDate.getMonth() + Math.floor(Math.random() * 3) + 1);
      
      events.push({
        id: uuidv4(),
        title: `Maintenance inspection: ${property.name}`,
        date: maintenanceDate.toISOString().split('T')[0],
        type: 'maintenance',
        propertyId: property.id,
        propertyName: property.name
      });
    });
    
    // Sort events by date
    return events.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error: any) {
    console.error('Error fetching property events:', error);
    return [];
  }
};

/**
 * Utility function to format compliance keys for display
 */
const formatComplianceKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};
