
import { supabase } from '@/integrations/supabase/client';
import { UtilityData } from '@/types/property';
import { getMockUtilityData, getMockPropertyUtilityData } from './utility-data-mock';

/**
 * Get utilities data for all properties
 */
export const getUtilities = async (): Promise<UtilityData[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  // Since the actual utility_data table doesn't exist yet, use mock data
  return getMockUtilityData();
};

/**
 * Get utilities for a specific property
 */
export const getPropertyUtilities = async (propertyId: string): Promise<UtilityData[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  // Since the actual utility_data table doesn't exist yet, use mock data
  return getMockPropertyUtilityData(propertyId);
};

/**
 * Add new utility data
 */
export const addUtilityData = async (utilityData: Partial<UtilityData>): Promise<UtilityData> => {
  // Since the actual utility_data table doesn't exist yet, return a mock response
  return {
    month: utilityData.month || new Date().toISOString().slice(0, 7),
    gasUsage: utilityData.gasUsage,
    gasCost: utilityData.gasCost,
    waterUsage: utilityData.waterUsage,
    waterCost: utilityData.waterCost,
    electricityUsage: utilityData.electricityUsage,
    electricityCost: utilityData.electricityCost
  };
};
