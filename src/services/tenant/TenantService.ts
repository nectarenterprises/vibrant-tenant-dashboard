
import { supabase } from "@/integrations/supabase/client";

export interface TenantInput {
  property_id: string;
  tenant_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface TenantDetails {
  id: string;
  property_id: string;
  tenant_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export const saveTenantDetails = async (tenantData: TenantInput): Promise<TenantDetails | null> => {
  try {
    // Check if tenant details already exist for this property
    const { data: existingTenants } = await supabase
      .from('tenant_details')
      .select('*')
      .eq('property_id', tenantData.property_id)
      .maybeSingle();
    
    let result;
    
    if (existingTenants) {
      // Update existing tenant details
      result = await supabase
        .from('tenant_details')
        .update({
          tenant_name: tenantData.tenant_name,
          contact_name: tenantData.contact_name || null,
          contact_email: tenantData.contact_email || null,
          contact_phone: tenantData.contact_phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTenants.id)
        .select()
        .single();
    } else {
      // Insert new tenant details
      result = await supabase
        .from('tenant_details')
        .insert({
          property_id: tenantData.property_id,
          tenant_name: tenantData.tenant_name,
          contact_name: tenantData.contact_name || null,
          contact_email: tenantData.contact_email || null,
          contact_phone: tenantData.contact_phone || null
        })
        .select()
        .single();
    }
    
    if (result.error) {
      console.error('Error saving tenant details:', result.error);
      return null;
    }
    
    return result.data as TenantDetails;
  } catch (error) {
    console.error('Error in saveTenantDetails:', error);
    return null;
  }
};

export const fetchTenantDetails = async (propertyId: string): Promise<TenantDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('tenant_details')
      .select('*')
      .eq('property_id', propertyId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching tenant details:', error);
      return null;
    }
    
    return data as TenantDetails;
  } catch (error) {
    console.error('Error in fetchTenantDetails:', error);
    return null;
  }
};
