
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Create a Supabase client
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Update the extraction status in the database
export async function updateExtractionStatus(
  supabase,
  documentId,
  status,
  extractedData = null,
  confidenceScores = null
) {
  try {
    console.log(`Updating document extraction status to ${status} for document ${documentId}`);
    
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    if (extractedData) {
      updateData.extracted_data = extractedData;
    }
    
    if (confidenceScores) {
      updateData.confidence_scores = confidenceScores;
    }
    
    const { error } = await supabase
      .from('property_document_extractions')
      .update(updateData)
      .eq('document_id', documentId);
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully updated extraction status to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating extraction status:', error);
    return false;
  }
}
