
import { supabase } from '@/integrations/supabase/client';
import { ComplianceItem } from '@/types/compliance';

/**
 * Get all compliance items for the current user
 */
export const getComplianceItems = async (): Promise<ComplianceItem[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('compliance_items')
    .select('*, properties!inner(user_id)')
    .eq('properties.user_id', user.user.id);
    
  if (error) {
    console.error('Error fetching compliance items:', error);
    throw new Error('Failed to fetch compliance items');
  }
  
  return data || [];
};

/**
 * Get compliance items for a specific property
 */
export const getPropertyComplianceItems = async (propertyId: string): Promise<ComplianceItem[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  const { data, error } = await supabase
    .from('compliance_items')
    .select('*')
    .eq('property_id', propertyId);
    
  if (error) {
    console.error('Error fetching property compliance items:', error);
    throw new Error('Failed to fetch property compliance items');
  }
  
  return data || [];
};

/**
 * Update compliance item status
 */
export const updateComplianceStatus = async (
  itemId: string, 
  lastCompleted: string, 
  nextDue: string
): Promise<ComplianceItem> => {
  if (!itemId) throw new Error('Compliance item ID is required');
  
  const { data, error } = await supabase
    .from('compliance_items')
    .update({
      last_completed: lastCompleted,
      next_due: nextDue,
      status: new Date(nextDue) < new Date() ? 'overdue' : 'upcoming'
    })
    .eq('id', itemId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating compliance status:', error);
    throw new Error('Failed to update compliance status');
  }
  
  return data;
};
