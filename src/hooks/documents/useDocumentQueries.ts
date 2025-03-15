
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PropertyDocument, DocumentType } from '@/types/property';
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
        const docs = await getPropertyDocuments(propertyId, folderType as DocumentType);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Failed to fetch documents",
          description: "There was an error loading your documents. Please try again.",
        });
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [propertyId, folderType]);

  // Function to manually trigger a document refresh
  const refetchDocuments = useCallback(async () => {
    if (!propertyId || !folderType) {
      return;
    }

    setDocumentsLoading(true);
    try {
      const docs = await getPropertyDocuments(propertyId, folderType as DocumentType);
      setDocuments(docs);
    } catch (error) {
      console.error('Error refreshing documents:', error);
      toast({
        variant: "destructive",
        title: "Failed to refresh documents",
        description: "There was an error reloading your documents. Please try again.",
      });
    } finally {
      setDocumentsLoading(false);
    }
  }, [propertyId, folderType]);

  // Recent documents query
  const recentDocumentsQuery = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => getRecentDocuments(5),
    enabled: true,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching recent documents:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch recent documents",
        description: "There was an error loading your recent documents.",
      });
    }
  });

  // Expiring documents query
  const expiringDocumentsQuery = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: () => getExpiringDocuments(30), // Documents expiring in next 30 days
    enabled: true,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching expiring documents:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch expiring documents",
        description: "There was an error loading your expiring documents.",
      });
    }
  });

  // Get documents by type for a specific property
  const getDocumentsByType = async (propertyId: string, docType: FolderType): Promise<PropertyDocument[]> => {
    if (!propertyId) return [];
    
    try {
      return await getPropertyDocuments(propertyId, docType as DocumentType);
    } catch (error) {
      console.error('Error fetching documents by type:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch documents",
        description: "Error fetching documents. Please try again.",
      });
      
      return [];
    }
  };

  return {
    documents,
    documentsLoading,
    refetchDocuments,
    recentDocuments: recentDocumentsQuery.data || [],
    recentDocumentsLoading: recentDocumentsQuery.isLoading,
    refetchRecentDocuments: recentDocumentsQuery.refetch,
    expiringDocuments: expiringDocumentsQuery.data || [],
    expiringDocumentsLoading: expiringDocumentsQuery.isLoading,
    refetchExpiringDocuments: expiringDocumentsQuery.refetch,
    getDocumentsByType
  };
};
