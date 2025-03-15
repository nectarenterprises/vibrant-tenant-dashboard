
import { DocumentType } from '@/types/property';
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
) => {
  return fetchDocumentMetadata(propertyId, documentType, searchOptions);
};

/**
 * Gets document version history
 */
export const getDocumentVersionHistory = async (documentId: string): Promise<DocumentVersion[]> => {
  return getDocumentVersions(documentId);
};

/**
 * Gets recently accessed documents
 */
export const getRecentDocuments = async (limit: number = 5) => {
  return fetchRecentDocuments(limit);
};

/**
 * Gets documents that are expiring soon
 */
export const getExpiringDocuments = async (daysThreshold: number = 90) => {
  return fetchExpiringDocuments(daysThreshold);
};
