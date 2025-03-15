
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Create a supabase client for database operations
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Update extraction status in the database
export async function updateExtractionStatus(supabase: any, documentId: string, status: string, extractedData?: any, confidenceScores?: any) {
  const updateData: any = {
    document_id: documentId,
    extraction_status: status
  };

  if (status === 'processing') {
    updateData.extraction_date = new Date().toISOString();
  }

  if (extractedData) {
    updateData.extracted_data = extractedData;
  }

  if (confidenceScores) {
    updateData.confidence_scores = confidenceScores;
  }

  const { error } = await supabase
    .from('utility_data_extractions')
    .upsert(updateData);

  if (error) {
    console.error('Error updating extraction status:', error);
    throw new Error('Failed to update extraction status');
  }
}
