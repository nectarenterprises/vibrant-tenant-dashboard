
import { supabase } from '@/integrations/supabase/client';
import { Property, EventData } from '@/types/property';
import { toast } from '@/components/ui/use-toast';

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
    return data.map(property => ({
      id: property.id,
      name: property.name,
      address: property.address,
      rentalFee: Number(property.rental_fee),
      nextPaymentDate: property.next_payment_date,
      leaseExpiry: property.lease_expiry,
      createdAt: property.created_at,
      updatedAt: property.updated_at
    }));
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

/**
 * Adds a new property for the current authenticated user
 */
export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to add properties",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        name: property.name,
        address: property.address,
        rental_fee: property.rentalFee,
        next_payment_date: property.nextPaymentDate,
        lease_expiry: property.leaseExpiry,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to add property",
        description: error.message,
      });
      return null;
    }
    
    toast({
      title: "Property added",
      description: `${property.name} has been added successfully.`,
    });
    
    // Transform to frontend model
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      rentalFee: Number(data.rental_fee),
      nextPaymentDate: data.next_payment_date,
      leaseExpiry: data.lease_expiry,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to add property",
      description: error.message || "An error occurred while adding the property",
    });
    return null;
  }
};
