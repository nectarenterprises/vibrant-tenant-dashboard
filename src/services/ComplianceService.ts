
import { supabase } from '@/integrations/supabase/client';
import { ComplianceItem } from '@/types/compliance';
import { getMockComplianceItems, getMockPropertyComplianceItems } from './compliance-items-mock';
import { Shield } from 'lucide-react';

/**
 * Get all compliance items for the current user
 */
export const getComplianceItems = async (): Promise<ComplianceItem[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  // Since the actual compliance_items table doesn't exist yet, use mock data
  return getMockComplianceItems(user.user.id);
};

/**
 * Get compliance items for a specific property
 */
export const getPropertyComplianceItems = async (propertyId: string): Promise<ComplianceItem[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  // Since the actual compliance_items table doesn't exist yet, use mock data
  return getMockPropertyComplianceItems(propertyId);
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
  
  // Since the actual compliance_items table doesn't exist yet, return a mock response
  const status = new Date(nextDue) < new Date() ? 'overdue' : 'upcoming';
  
  return {
    id: itemId,
    name: 'Updated Compliance Item',
    icon: Shield,
    lastCompleted,
    nextDue,
    status: status as 'completed' | 'upcoming' | 'overdue',
    certificates: []
  };
};
