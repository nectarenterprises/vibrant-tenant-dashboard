
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Records document access to track recent documents
 */
export const recordDocumentAccess = async (documentId: string): Promise<boolean> => {
  try {
    console.log(`Recording access for document: ${documentId}`);
    
    const { data, error } = await supabase
      .from('property_documents')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', documentId);
    
    if (error) {
      console.error('Error recording document access:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception recording document access:', error);
    return false;
  }
};

/**
 * Gets documents that have been recently accessed
 */
export const getRecentlyAccessedDocuments = async (limit: number = 5): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .order('last_accessed', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recently accessed documents:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching recently accessed documents:', error);
    return [];
  }
};
