
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface PropertyDetailsInput {
  property_id: string;
  property_type?: string;
  floor_area?: string;
  year_built?: string;
  parking_spaces?: string;
  lease_type?: string;
  lease_start?: string;
  lease_duration?: string;
  security_deposit?: string;
}

// Fetch property details from the database
export const fetchPropertyDetails = async (propertyId: string) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('property_details, incentives')
      .eq('id', propertyId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.property_details || null;
  } catch (error: any) {
    console.error('Error fetching property details:', error);
    return null;
  }
};

// Save property details to the database
export const savePropertyDetails = async (input: PropertyDetailsInput): Promise<boolean> => {
  try {
    const { property_id, ...detailsToUpdate } = input;
    
    // First, fetch existing property details
    const { data: existingData, error: fetchError } = await supabase
      .from('properties')
      .select('property_details')
      .eq('id', property_id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Prepare property details object
    const currentDetails = existingData?.property_details || {};
    const updatedDetails = {
      ...currentDetails,
      property_type: detailsToUpdate.property_type,
      floor_area: detailsToUpdate.floor_area,
      year_built: detailsToUpdate.year_built,
      parking_spaces: detailsToUpdate.parking_spaces,
      lease_type: detailsToUpdate.lease_type,
      lease_start: detailsToUpdate.lease_start,
      lease_duration: detailsToUpdate.lease_duration,
      security_deposit: detailsToUpdate.security_deposit
    };
    
    // Update the property details in the database
    const { error } = await supabase
      .from('properties')
      .update({ 
        property_details: updatedDetails,
        updated_at: new Date().toISOString()
      })
      .eq('id', property_id);
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Success",
      description: "Property details updated successfully.",
    });
    
    return true;
  } catch (error: any) {
    console.error('Error saving property details:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: `Failed to save property details: ${error.message}`,
    });
    return false;
  }
};
