
import { supabase } from '@/integrations/supabase/client';

/**
 * Record document access timestamp
 * @param documentId ID of the document accessed
 * @returns Update result with success or error
 */
export const recordDocumentAccess = async (documentId: string) => {
  if (!documentId) return { success: false };
  
  try {
    const { error } = await supabase
      .from('property_documents')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', documentId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error recording document access:', error);
    return { success: false };
  }
};
