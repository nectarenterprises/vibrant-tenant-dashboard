
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyDocument } from '@/types/property';
import { FolderType } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';

// Import the smaller, more focused hooks
import { useDocumentQueries } from './useDocumentQueries';
import { useDocumentMutations } from './useDocumentMutations';
import { useDocumentSelection } from './useDocumentSelection';
import { useDocumentUpload } from './useDocumentUpload';

/**
 * Main hook that composes smaller document hooks
 */
export const usePropertyDocuments = () => {
  // Use the document selection hook
  const {
    selectedProperty,
    selectedFolder,
    searchQuery,
    setSearchQuery,
    setSelectedProperty,
    setSelectedFolder,
    getFilteredDocuments: filterDocuments,
    handlePropertySelect,
    handleFolderSelect,
    handleDownload,
    recordDocumentAccess
  } = useDocumentSelection();

  // Use document queries hook
  const {
    documents,
    documentsLoading,
    refetchDocuments,
    recentDocuments,
    recentDocumentsLoading,
    expiringDocuments,
    expiringDocumentsLoading,
    getDocumentsByType
  } = useDocumentQueries(selectedProperty, selectedFolder);

  // Use the document upload hook
  const {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    isUploading,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    setIsUploading,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  } = useDocumentUpload();

  // Use document mutations hook
  const {
    uploadMutation,
    deleteMutation
  } = useDocumentMutations(
    selectedProperty?.id, 
    selectedFolder?.type,
    resetUploadForm
  );

  // Fetch properties function
  const fetchProperties = async (userId: string): Promise<Property[]> => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data.map(property => ({
        id: property.id,
        name: property.name,
        address: property.address,
        rentalFee: Number(property.rental_fee),
        nextPaymentDate: property.next_payment_date,
        leaseExpiry: property.lease_expiry,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
        incentives: [] // Adding empty incentives array as required by Property type
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch properties",
        description: "There was an error loading your properties."
      });
      return [];
    }
  };

  // Handle document deletion
  const handleDelete = async (document: PropertyDocument) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      try {
        const success = await deleteDocument(document.id, document.filePath);
        if (success) {
          toast({
            title: "Document deleted",
            description: `${document.name} has been deleted.`
          });
          refetchDocuments();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "There was an error deleting the document."
        });
      }
    }
  };

  // Create a wrapper for getFilteredDocuments that uses the current documents
  const getFilteredDocuments = () => {
    return filterDocuments(documents);
  };

  return {
    // From document selection hook
    selectedProperty,
    selectedFolder,
    searchQuery,
    handlePropertySelect,
    handleFolderSelect,
    handleDownload,
    setSearchQuery,
    getFilteredDocuments,
    
    // From document upload hook
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    isUploading,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    resetUploadForm,
    handleFileSelect,
    
    // From document queries hook
    documents,
    documentsLoading,
    refetchDocuments,
    recentDocuments,
    recentDocumentsLoading,
    expiringDocuments,
    expiringDocumentsLoading,
    getDocumentsByType,
    
    // Additional methods
    uploadMutation,
    deleteMutation,
    fetchProperties,
    handleDelete,
    recordDocumentAccess
  };
};
