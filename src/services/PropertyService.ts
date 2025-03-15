
import { supabase } from '@/integrations/supabase/client';
import { Property, Incentive } from '@/types/property';

/**
 * Get all properties for the current user
 */
export const getProperties = async (): Promise<Property[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.user.id);
    
  if (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
  
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    address: item.address,
    rentalFee: parseFloat(item.rental_fee || '0'),
    nextPaymentDate: item.next_payment_date,
    leaseExpiry: item.lease_expiry,
    image: item.image_path,
    premisesSchedule: item.premises_schedule,
    incentives: parseIncentives(item.incentives),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    serviceChargeAmount: item.service_charge_amount ? parseFloat(item.service_charge_amount) : undefined,
    leaseStart: item.lease_start,
    leaseType: item.lease_type
  }));
};

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
    rentalFee: parseFloat(data.rental_fee || '0'),
    nextPaymentDate: data.next_payment_date,
    leaseExpiry: data.lease_expiry,
    image: data.image_path,
    premisesSchedule: data.premises_schedule,
    incentives: parseIncentives(data.incentives),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    serviceChargeAmount: data.service_charge_amount ? parseFloat(data.service_charge_amount) : undefined,
    leaseStart: data.lease_start,
    leaseType: data.lease_type
  };
};

/**
 * Create a new property
 */
export const createProperty = async (property: Partial<Property>): Promise<Property> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  // Transform the property object to match the database schema
  const dbProperty = {
    name: property.name || '',
    address: property.address || '',
    rental_fee: property.rentalFee ? property.rentalFee.toString() : '0',
    next_payment_date: property.nextPaymentDate || new Date().toISOString(),
    lease_expiry: property.leaseExpiry || new Date().toISOString(),
    image_path: property.image,
    premises_schedule: property.premisesSchedule,
    incentives: property.incentives ? JSON.stringify(property.incentives) : null,
    lease_start: property.leaseStart,
    lease_type: property.leaseType,
    user_id: user.user.id
  };
  
  const { data, error } = await supabase
    .from('properties')
    .insert([dbProperty])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
  
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    rentalFee: parseFloat(data.rental_fee || '0'),
    nextPaymentDate: data.next_payment_date,
    leaseExpiry: data.lease_expiry,
    image: data.image_path,
    premisesSchedule: data.premises_schedule,
    incentives: parseIncentives(data.incentives),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    serviceChargeAmount: data.service_charge_amount ? parseFloat(data.service_charge_amount) : undefined,
    leaseStart: data.lease_start,
    leaseType: data.lease_type
  };
};

// Helper function to parse incentives
export const parseIncentives = (incentivesData: any): Incentive[] => {
  if (!incentivesData) return [];
  
  try {
    // If it's a string, parse it
    if (typeof incentivesData === 'string') {
      return JSON.parse(incentivesData);
    }
    
    // If it's already an array, return it
    if (Array.isArray(incentivesData)) {
      return incentivesData as Incentive[];
    }
    
    // If it has an 'incentives' property that's an array, return that
    if (incentivesData.incentives && Array.isArray(incentivesData.incentives)) {
      return incentivesData.incentives;
    }
    
    return [];
  } catch (e) {
    console.error('Error parsing incentives:', e);
    return [];
  }
};
