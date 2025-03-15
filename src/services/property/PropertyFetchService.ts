
import { supabase } from '@/integrations/supabase/client';
import { Property, EventData } from '@/types/property';
import { parseIncentives } from '@/services/PropertyService';

/**
 * Get a property by ID
 */
export const getProperty = async (id: string): Promise<Property> => {
  if (!id) throw new Error('Property ID is required');
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
  
  if (!data) {
    throw new Error('Property not found');
  }
  
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    rentalFee: parseFloat(String(data.rental_fee)) || 0,
    nextPaymentDate: data.next_payment_date,
    leaseExpiry: data.lease_expiry,
    image: data.image_path,
    premisesSchedule: data.premises_schedule,
    incentives: parseIncentives(data.incentives) || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    serviceChargeAmount: typeof data.incentives === 'object' && data.incentives !== null && !Array.isArray(data.incentives) ? 
      parseFloat(String(data.incentives.service_charge_amount || 0)) : undefined,
    leaseStart: data.lease_start,
    leaseType: data.lease_type
  };
};

/**
 * Fetch property events for the calendar
 */
export const fetchPropertyEvents = async (): Promise<EventData[]> => {
  try {
    // Get all properties to extract events
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*');
      
    if (error) {
      console.error('Error fetching property events:', error);
      throw new Error('Failed to fetch property events');
    }
    
    // Transform properties to event data
    const events: EventData[] = [];
    
    // Add rent payment events
    properties.forEach(property => {
      // Add rent payment event
      events.push({
        id: `rent-${property.id}`,
        title: `Rent Payment: ${property.name}`,
        date: property.next_payment_date,
        type: 'rent',
        propertyId: property.id,
        propertyName: property.name
      });
      
      // Add lease expiry event
      events.push({
        id: `expiry-${property.id}`,
        title: `Lease Expiry: ${property.name}`,
        date: property.lease_expiry,
        type: 'other',
        propertyId: property.id,
        propertyName: property.name
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error in fetchPropertyEvents:', error);
    return [];
  }
};

/**
 * Fetch all properties for the current user
 */
export const fetchUserProperties = async (): Promise<Property[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.user.id);
      
    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      address: item.address,
      rentalFee: parseFloat(String(item.rental_fee || '0')),
      nextPaymentDate: item.next_payment_date,
      leaseExpiry: item.lease_expiry,
      image: item.image_path,
      premisesSchedule: item.premises_schedule,
      incentives: parseIncentives(item.incentives),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      serviceChargeAmount: typeof item.incentives === 'object' && item.incentives !== null && !Array.isArray(item.incentives) ? 
        parseFloat(String(item.incentives.service_charge_amount || 0)) : undefined,
      leaseStart: item.lease_start,
      leaseType: item.lease_type
    }));
  } catch (error) {
    console.error('Error in fetchUserProperties:', error);
    return [];
  }
};
