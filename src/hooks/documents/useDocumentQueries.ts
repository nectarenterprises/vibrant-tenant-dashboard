
import { useQuery } from '@tanstack/react-query';
import { FolderType } from '@/services/document/types';
import { getPropertyDocuments, getRecentDocuments, getExpiringDocuments } from '@/services/document';

/**
 * Custom hook to fetch documents based on property and folder
 */
export const useDocumentQueries = (propertyId?: string, folderType?: FolderType) => {
  // Main documents query
  const {
    data: documents = [],
    isLoading: documentsLoading,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['documents', propertyId, folderType],
    queryFn: async () => {
      if (!propertyId) return [];
      const docs = await getPropertyDocuments(propertyId);
      
      // Filter by folder type if provided
      if (folderType) {
        return docs.filter(doc => doc.documentType === folderType);
      }
      
      return docs;
    },
    enabled: !!propertyId
  });

  // Recent documents query
  const {
    data: recentDocuments = [],
    isLoading: recentDocumentsLoading
  } = useQuery({
    queryKey: ['recent-documents', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      return getRecentDocuments(propertyId, 5);
    },
    enabled: !!propertyId
  });

  // Expiring documents query
  const {
    data: expiringDocuments = [],
    isLoading: expiringDocumentsLoading
  } = useQuery({
    queryKey: ['expiring-documents', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      return getExpiringDocuments(propertyId, 30); // Next 30 days
    },
    enabled: !!propertyId
  });

  // Helper to get documents by type
  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.documentType === type);
  };

  return {
    documents,
    documentsLoading,
    refetchDocuments,
    recentDocuments,
    recentDocumentsLoading,
    expiringDocuments,
    expiringDocumentsLoading,
    getDocumentsByType
  };
};
