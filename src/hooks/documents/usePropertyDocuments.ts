
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyDocument } from '@/types/property';
import { FolderType } from '@/services/document/types';

// Import the smaller, more focused hooks
import { useDocumentQueries } from './useDocumentQueries';
import { useDocumentMutations } from './useDocumentMutations';
import { useDocumentSelection } from './useDocumentSelection';
import { useDocumentUpload } from './useDocumentUpload';

/**
 * Main hook that composes smaller document hooks
 */
export const usePropertyDocuments = () => {
  // Use the document upload hook
  const {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  } = useDocumentUpload();

  // Use the document selection hook
  const {
    selectedProperty,
    selectedFolder,
    searchQuery,
    setSearchQuery,
    setSelectedProperty,
    setSelectedFolder,
    getFilteredDocuments,
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
  };

  // Handle document deletion
  const handleDelete = (document: PropertyDocument) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      deleteMutation.mutate({ id: document.id, filePath: document.filePath });
    }
  };

  // Handle document upload
  const handleUpload = () => {
    const uploadData = prepareUpload();
    if (uploadData) {
      uploadMutation.mutate(uploadData);
    }
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
    handleUpload,
    recordDocumentAccess
  };
};
