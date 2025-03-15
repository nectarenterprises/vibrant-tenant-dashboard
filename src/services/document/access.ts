
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument } from '@/types/property';

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

/**
 * For backward compatibility - accepts either a document ID or a document object
 */
export const updateDocumentAccessTimestamp = async (document: string | PropertyDocument) => {
  const documentId = typeof document === 'string' ? document : document.id;
  return recordDocumentAccess(documentId);
};
