
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates last accessed timestamp for a document
 */
export const updateDocumentAccessTimestamp = async (documentId: string): Promise<void> => {
  try {
    await supabase
      .from('property_documents')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', documentId);
  } catch (error) {
    console.error('Error updating document access timestamp:', error);
  }
};
