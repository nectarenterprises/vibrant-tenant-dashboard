
import { supabase } from "@/integrations/supabase/client";
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

export const savePropertyDetails = async (
  propertyData: PropertyDetailsInput
): Promise<boolean> => {
  try {
    // Store property details in the incentives JSON field
    // First fetch the current incentives data
    const { data: currentProperty, error: fetchError } = await supabase
      .from('properties')
      .select('incentives')
      .eq('id', propertyData.property_id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching property:', fetchError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch property details.",
      });
      return false;
    }
    
    // Parse existing incentives/metadata or create new object
    let metadata: Record<string, any> = {};
    try {
      const incentivesData = currentProperty?.incentives;
      if (incentivesData) {
        metadata = typeof incentivesData === 'string' 
          ? JSON.parse(incentivesData) 
          : incentivesData;
      }
    } catch (e) {
      console.error("Error parsing incentives data:", e);
      metadata = {};
    }
    
    // Ensure we preserve existing data
    const propertyDetails = {
      ...metadata,
      property_details: {
        property_type: propertyData.property_type || '',
        floor_area: propertyData.floor_area || '',
        year_built: propertyData.year_built || '',
        parking_spaces: propertyData.parking_spaces || '',
        lease_type: propertyData.lease_type || '',
        lease_start: propertyData.lease_start || '',
        lease_duration: propertyData.lease_duration || '',
        security_deposit: propertyData.security_deposit || ''
      }
    };
    
    // Make sure we preserve the incentives array if it exists
    if (!propertyDetails.hasOwnProperty('incentives') && metadata.hasOwnProperty('incentives')) {
      propertyDetails.incentives = metadata.incentives;
    }
    
    // Update the property with the new metadata
    const { error } = await supabase
      .from('properties')
      .update({ 
        incentives: propertyDetails,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyData.property_id);
    
    if (error) {
      console.error('Error saving property details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save property details.",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Property details saved successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error in savePropertyDetails:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred while saving property details.",
    });
    return false;
  }
};

export const fetchPropertyDetails = async (
  propertyId: string
): Promise<{
  property_type: string;
  floor_area: string;
  year_built: string;
  parking_spaces: string;
  lease_type: string;
  lease_start: string;
  lease_duration: string;
  security_deposit: string;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('incentives')
      .eq('id', propertyId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
    
    if (!data?.incentives) return null;
    
    // Parse the incentives/metadata
    try {
      const metadata = typeof data.incentives === 'string' 
        ? JSON.parse(data.incentives) 
        : data.incentives;
      
      if (metadata.property_details) {
        return metadata.property_details;
      }
      
      return null;
    } catch (e) {
      console.error("Error parsing incentives data:", e);
      return null;
    }
  } catch (error) {
    console.error('Error in fetchPropertyDetails:', error);
    return null;
  }
};
