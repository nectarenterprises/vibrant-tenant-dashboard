
import { useQuery } from '@tanstack/react-query';
import { Property, PropertyDocument } from '@/types/property';
import { 
  getPropertyDocuments,
  getRecentDocuments,
  getExpiringDocuments
} from '@/services/document';
import { FolderType } from '@/services/document/types';

/**
 * Hook for document-related queries
 */
export const useDocumentQueries = (
  selectedProperty: Property | null,
  selectedFolder: { type: FolderType } | null
) => {
  // Documents query
  const { 
    data: documents = [], 
    isLoading: documentsLoading, 
    refetch: refetchDocuments 
  } = useQuery({
    queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type],
    queryFn: () => getPropertyDocuments(selectedProperty?.id || '', selectedFolder?.type),
    enabled: !!selectedProperty?.id && !!selectedFolder
  });

  // Recent documents query
  const { 
    data: recentDocuments = [], 
    isLoading: recentDocumentsLoading 
  } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => getRecentDocuments(5),
    enabled: true
  });

  // Expiring documents query
  const { 
    data: expiringDocuments = [], 
    isLoading: expiringDocumentsLoading 
  } = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: () => getExpiringDocuments(30), // Documents expiring in next 30 days
    enabled: true
  });

  // Get documents by type for a specific property
  const getDocumentsByType = async (propertyId: string, docType: FolderType): Promise<PropertyDocument[]> => {
    if (!propertyId) return [];
    
    try {
      return await getPropertyDocuments(propertyId, docType);
    } catch (error) {
      console.error('Error fetching documents by type:', error);
      return [];
    }
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
