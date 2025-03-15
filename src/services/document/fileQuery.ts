
import { PropertyDocument, DocumentType } from '@/types/property';
import { 
  fetchDocumentMetadata, 
  getDocumentVersions, 
  fetchRecentDocuments, 
  fetchExpiringDocuments 
} from './metadata';
import { DocumentVersion } from './types';

/**
 * Fetches all documents for a property
 */
export const getPropertyDocuments = async (
  propertyId: string,
  documentType?: DocumentType,
  searchOptions?: {
    searchQuery?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    isFavorite?: boolean;
    sortBy?: 'date' | 'name' | 'type';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PropertyDocument[]> => {
  if (!propertyId) {
    console.warn('getPropertyDocuments called with empty propertyId');
    return [];
  }
  
  try {
    return await fetchDocumentMetadata(propertyId, documentType, searchOptions);
  } catch (error) {
    console.error('Error in getPropertyDocuments:', error);
    return [];
  }
};

/**
 * Alias for getPropertyDocuments for consistency
 */
export const getDocuments = getPropertyDocuments;

/**
 * Search documents by query and options
 */
export const searchDocuments = async (
  searchQuery: string,
  options?: {
    propertyId?: string;
    documentType?: DocumentType;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    isFavorite?: boolean;
    sortBy?: 'date' | 'name' | 'type';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PropertyDocument[]> => {
  try {
    return await fetchDocumentMetadata(
      options?.propertyId || '',
      options?.documentType,
      { 
        searchQuery,
        tags: options?.tags,
        startDate: options?.startDate,
        endDate: options?.endDate,
        isFavorite: options?.isFavorite,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder
      }
    );
  } catch (error) {
    console.error('Error in searchDocuments:', error);
    return [];
  }
};

/**
 * Gets document by ID
 */
export const getDocumentById = async (documentId: string): Promise<PropertyDocument | null> => {
  if (!documentId) return null;
  
  try {
    const results = await fetchDocumentMetadata('', undefined, { searchQuery: documentId });
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error in getDocumentById:', error);
    return null;
  }
};

/**
 * Gets documents by folder ID
 */
export const getDocumentsByFolderId = async (
  folderId: string,
  options?: {
    searchQuery?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    isFavorite?: boolean;
    sortBy?: 'date' | 'name' | 'type';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PropertyDocument[]> => {
  if (!folderId) return [];
  
  try {
    // For now, map folder ID to document type
    const documentType = folderId as DocumentType;
    return await fetchDocumentMetadata('', documentType, options);
  } catch (error) {
    console.error('Error in getDocumentsByFolderId:', error);
    return [];
  }
};

/**
 * Gets document version history
 */
export const getDocumentVersionHistory = async (documentId: string): Promise<DocumentVersion[]> => {
  if (!documentId) return [];
  
  try {
    return await getDocumentVersions(documentId);
  } catch (error) {
    console.error('Error getting document version history:', error);
    return [];
  }
};

/**
 * Gets recently accessed documents
 */
export const getRecentDocuments = async (limit: number = 5): Promise<PropertyDocument[]> => {
  try {
    return await fetchRecentDocuments(limit);
  } catch (error) {
    console.error('Error getting recent documents:', error);
    return [];
  }
};

/**
 * Gets documents that are expiring soon
 */
export const getExpiringDocuments = async (daysThreshold: number = 90): Promise<PropertyDocument[]> => {
  try {
    return await fetchExpiringDocuments(daysThreshold);
  } catch (error) {
    console.error('Error getting expiring documents:', error);
    return [];
  }
};
