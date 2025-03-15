
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { DocumentSearchOptions, FolderType, PropertyDocumentResponse, transformToPropertyDocument } from './types';

/**
 * Fetches document metadata from the database
 */
export const fetchDocumentMetadata = async (
  propertyId: string, 
  documentType?: DocumentType,
  searchOptions?: DocumentSearchOptions
): Promise<PropertyDocument[]> => {
  try {
    let query = supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId);
    
    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    // Apply search and filter options
    if (searchOptions) {
      if (searchOptions.searchQuery) {
        query = query.or(`name.ilike.%${searchOptions.searchQuery}%,description.ilike.%${searchOptions.searchQuery}%`);
      }

      if (searchOptions.tags && searchOptions.tags.length > 0) {
        // Note: This is a simplified approach for tag filtering
        for (const tag of searchOptions.tags) {
          query = query.filter('tags', 'cs', tag);
        }
      }

      if (searchOptions.startDate) {
        query = query.gte('upload_date', searchOptions.startDate.toISOString());
      }

      if (searchOptions.endDate) {
        query = query.lte('upload_date', searchOptions.endDate.toISOString());
      }

      if (searchOptions.isFavorite !== undefined) {
        query = query.eq('is_favorite', searchOptions.isFavorite);
      }
    }
    
    // Apply sorting
    const sortField = searchOptions?.sortBy === 'date' ? 'upload_date' : 
                      searchOptions?.sortBy === 'name' ? 'name' : 
                      searchOptions?.sortBy === 'type' ? 'document_type' : 
                      'upload_date';
    const sortDirection = searchOptions?.sortOrder || 'desc';
    
    const { data, error } = await query.order(sortField, { ascending: sortDirection === 'asc' });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(error.message);
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data response format:', data);
      throw new Error('Server returned an invalid response format');
    }
    
    // Transform to frontend model
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    // Improved error logging for JSON parse errors
    console.error('Error in fetchDocumentMetadata:', error);
    
    // Special handling for JSON parse errors
    const errorMessage = error.message || "An error occurred while fetching documents";
    const isJsonError = errorMessage.includes('JSON');
    
    if (isJsonError) {
      console.error('JSON parsing error detected in response');
    }
    
    toast({
      variant: "destructive",
      title: "Failed to fetch documents",
      description: isJsonError 
        ? "Invalid data received from server. Please try again." 
        : errorMessage,
    });
    
    return [];
  }
};

/**
 * Fetches recently accessed documents
 */
export const fetchRecentDocuments = async (limit: number = 5): Promise<PropertyDocument[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(error.message);
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data response format:', data);
      throw new Error('Server returned an invalid response format');
    }
    
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    console.error('Error in fetchRecentDocuments:', error);
    
    // Special handling for JSON parse errors
    const errorMessage = error.message || "An error occurred while fetching recent documents";
    const isJsonError = errorMessage.includes('JSON');
    
    toast({
      variant: "destructive",
      title: "Failed to fetch recent documents",
      description: isJsonError 
        ? "Invalid data received from server. Please try again." 
        : errorMessage,
    });
    
    return [];
  }
};

/**
 * Fetch documents with upcoming expirations
 */
export const fetchExpiringDocuments = async (daysThreshold: number = 90): Promise<PropertyDocument[]> => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .lt('expiry_date', thresholdDate.toISOString())
      .gt('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(error.message);
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data response format:', data);
      throw new Error('Server returned an invalid response format');
    }
    
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    console.error('Error in fetchExpiringDocuments:', error);
    
    // Special handling for JSON parse errors
    const errorMessage = error.message || "An error occurred while fetching expiring documents";
    const isJsonError = errorMessage.includes('JSON');
    
    toast({
      variant: "destructive",
      title: "Failed to fetch expiring documents",
      description: isJsonError 
        ? "Invalid data received from server. Please try again." 
        : errorMessage,
    });
    
    return [];
  }
};
