
import { supabase } from '@/integrations/supabase/client';
import { UtilityData } from '@/types/property';

/**
 * Get utilities data for all properties
 */
export const getUtilities = async (): Promise<UtilityData[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('utility_data')
    .select('*, properties!inner(user_id)')
    .eq('properties.user_id', user.user.id);
    
  if (error) {
    console.error('Error fetching utilities:', error);
    throw new Error('Failed to fetch utility data');
  }
  
  return data || [];
};

/**
 * Get utilities for a specific property
 */
export const getPropertyUtilities = async (propertyId: string): Promise<UtilityData[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  const { data, error } = await supabase
    .from('utility_data')
    .select('*')
    .eq('property_id', propertyId);
    
  if (error) {
    console.error('Error fetching property utilities:', error);
    throw new Error('Failed to fetch property utility data');
  }
  
  return data || [];
};

/**
 * Add new utility data
 */
export const addUtilityData = async (utilityData: Partial<UtilityData>): Promise<UtilityData> => {
  const { data, error } = await supabase
    .from('utility_data')
    .insert([utilityData])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding utility data:', error);
    throw new Error('Failed to add utility data');
  }
  
  return data;
};
