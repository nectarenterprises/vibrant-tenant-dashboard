
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PropertyDocument } from '@/types/property';
import { 
  getPropertyDocuments,
  getRecentDocuments,
  getExpiringDocuments
} from '@/services/document';
import { FolderType } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for document-related queries
 */
export const useDocumentQueries = (
  propertyId: string | undefined,
  folderType: FolderType | undefined
) => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Fetch documents when property or folder changes
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!propertyId || !folderType) {
        setDocuments([]);
        return;
      }

      setDocumentsLoading(true);
      try {
        const docs = await getPropertyDocuments(propertyId, folderType);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Failed to fetch documents",
          description: "There was an error loading your documents.",
        });
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [propertyId, folderType]);

  // Function to manually trigger a document refresh
  const refetchDocuments = async () => {
    if (!propertyId || !folderType) {
      return;
    }

    setDocumentsLoading(true);
    try {
      const docs = await getPropertyDocuments(propertyId, folderType);
      setDocuments(docs);
    } catch (error) {
      console.error('Error refreshing documents:', error);
      toast({
        variant: "destructive",
        title: "Failed to refresh documents",
        description: "There was an error reloading your documents.",
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Recent documents query
  const { 
    data: recentDocuments = [], 
    isLoading: recentDocumentsLoading,
    refetch: refetchRecentDocuments 
  } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => getRecentDocuments(5),
    enabled: true
  });

  // Expiring documents query
  const { 
    data: expiringDocuments = [], 
    isLoading: expiringDocumentsLoading,
    refetch: refetchExpiringDocuments
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
    refetchRecentDocuments,
    expiringDocuments,
    expiringDocumentsLoading,
    refetchExpiringDocuments,
    getDocumentsByType
  };
};
