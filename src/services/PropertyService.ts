
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';

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
  
  return data || [];
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
  
  return data;
};

/**
 * Create a new property
 */
export const createProperty = async (property: Partial<Property>): Promise<Property> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('properties')
    .insert([{
      ...property,
      user_id: user.user.id,
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
  
  return data;
};
