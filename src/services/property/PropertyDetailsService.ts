
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
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // If no data is found, return null
    if (!data) {
      return null;
    }
    
    // Return structured property details from various columns
    return {
      property_type: data.property_type || '',
      floor_area: data.floor_area || '',
      year_built: data.year_built || '',
      parking_spaces: data.parking_spaces || '',
      lease_type: data.lease_type || '',
      lease_start: data.lease_start || undefined,
      lease_duration: data.lease_duration || '',
      security_deposit: data.security_deposit || ''
    };
  } catch (error: any) {
    console.error('Error fetching property details:', error);
    return null;
  }
};

// Save property details to the database
export const savePropertyDetails = async (input: PropertyDetailsInput): Promise<boolean> => {
  try {
    const { property_id, ...detailsToUpdate } = input;
    
    // Update the property details directly in the properties table
    const { error } = await supabase
      .from('properties')
      .update({ 
        property_type: detailsToUpdate.property_type,
        floor_area: detailsToUpdate.floor_area,
        year_built: detailsToUpdate.year_built,
        parking_spaces: detailsToUpdate.parking_spaces,
        lease_type: detailsToUpdate.lease_type,
        lease_start: detailsToUpdate.lease_start,
        lease_duration: detailsToUpdate.lease_duration,
        security_deposit: detailsToUpdate.security_deposit,
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
