
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
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
    rentalFee: parseFloat(data.rental_fee) || 0,
    nextPaymentDate: data.next_payment_date,
    leaseExpiry: data.lease_expiry,
    image: data.image_path,
    premisesSchedule: data.premises_schedule,
    incentives: parseIncentives ? parseIncentives(data.incentives) : [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    serviceChargeAmount: data.service_charge_amount,
    leaseStart: data.lease_start,
    leaseType: data.lease_type
  };
};
