
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
      toast({
        variant: "destructive",
        title: "Failed to fetch documents",
        description: error.message,
      });
      return [];
    }
    
    // Transform to frontend model
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch documents",
      description: error.message || "An error occurred while fetching documents",
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
      toast({
        variant: "destructive",
        title: "Failed to fetch recent documents",
        description: error.message,
      });
      return [];
    }
    
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch recent documents",
      description: error.message || "An error occurred while fetching recent documents",
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
      toast({
        variant: "destructive",
        title: "Failed to fetch expiring documents",
        description: error.message,
      });
      return [];
    }
    
    return (data as PropertyDocumentResponse[]).map(transformToPropertyDocument);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch expiring documents",
      description: error.message || "An error occurred while fetching expiring documents",
    });
    return [];
  }
};
