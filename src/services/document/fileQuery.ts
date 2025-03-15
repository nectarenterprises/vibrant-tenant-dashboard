
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
