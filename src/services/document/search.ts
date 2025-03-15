
import { PropertyDocument, DocumentType } from '@/types/property';
import { DocumentSearchOptions } from './types';
import { supabase } from '@/integrations/supabase/client';
import { transformToPropertyDocument } from './types';

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
    
    // Apply search filters if provided
    if (searchOptions) {
      if (searchOptions.searchQuery) {
        query = query.or(`name.ilike.%${searchOptions.searchQuery}%,description.ilike.%${searchOptions.searchQuery}%`);
      }
      
      if (searchOptions.isFavorite !== undefined) {
        query = query.eq('is_favorite', searchOptions.isFavorite);
      }
      
      if (searchOptions.startDate) {
        query = query.gte('upload_date', searchOptions.startDate.toISOString());
      }
      
      if (searchOptions.endDate) {
        query = query.lte('upload_date', searchOptions.endDate.toISOString());
      }
      
      // Apply sorting if provided
      if (searchOptions.sortBy) {
        const order = searchOptions.sortOrder === 'desc' ? true : false;
        let column = 'upload_date';
        
        switch (searchOptions.sortBy) {
          case 'name':
            column = 'name';
            break;
          case 'type':
            column = 'document_type';
            break;
          default:
            column = 'upload_date';
        }
        
        query = query.order(column, { ascending: !order });
      } else {
        // Default sorting by upload date, newest first
        query = query.order('upload_date', { ascending: false });
      }
    } else {
      // Default sorting
      query = query.order('upload_date', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error in fetchDocumentMetadata:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Simply return empty array if no data
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(doc => transformToPropertyDocument(doc));
  } catch (error) {
    console.error('Error in fetchDocumentMetadata:', error);
    throw error;
  }
};

/**
 * Fetches recently accessed documents
 */
export const fetchRecentDocuments = async (limit: number = 5): Promise<PropertyDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .order('last_accessed', { ascending: false, nullsFirst: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent documents:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(doc => transformToPropertyDocument(doc));
  } catch (error) {
    console.error('Error in fetchRecentDocuments:', error);
    throw error;
  }
};

/**
 * Fetches documents that are expiring soon
 */
export const fetchExpiringDocuments = async (daysThreshold: number = 90): Promise<PropertyDocument[]> => {
  try {
    // Calculate the date daysThreshold days from now
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .not('expiry_date', 'is', null)
      .lte('expiry_date', thresholdDate.toISOString())
      .order('expiry_date', { ascending: true })
      .limit(10);
    
    if (error) {
      console.error('Error fetching expiring documents:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(doc => transformToPropertyDocument(doc));
  } catch (error) {
    console.error('Error in fetchExpiringDocuments:', error);
    throw error;
  }
};
