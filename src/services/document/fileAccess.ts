
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

/**
 * Records document access by updating the last_accessed timestamp
 */
export const recordDocumentAccess = async (documentId: string): Promise<void> => {
  try {
    await updateDocumentAccessTimestamp(documentId);
    console.log(`Recorded access for document: ${documentId}`);
  } catch (error) {
    console.error('Error recording document access:', error);
  }
};

/**
 * Gets recently accessed documents
 */
export const getRecentlyAccessedDocuments = async (limit: number = 5): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .not('last_accessed', 'is', null)
      .order('last_accessed', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recently accessed documents:', error);
    return [];
  }
};
