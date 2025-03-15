
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyDocument } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { 
  uploadPropertyDocument,
  downloadDocument,
  deleteDocument,
  getPropertyDocuments,
  getRecentDocuments,
  getExpiringDocuments,
  recordDocumentAccess
} from '@/services/document';
import { FolderType, DocumentFolder } from '@/services/document/types';

export const usePropertyDocuments = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState<FolderType>('lease');
  
  const queryClient = useQueryClient();

  // Fetch properties query
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

  // Documents query
  const { data: documents = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type],
    queryFn: () => getPropertyDocuments(selectedProperty?.id || '', selectedFolder?.type),
    enabled: !!selectedProperty?.id && !!selectedFolder
  });

  // Recent documents query
  const { data: recentDocuments = [], isLoading: recentDocumentsLoading } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => getRecentDocuments(5),
    enabled: true
  });

  // Expiring documents query
  const { data: expiringDocuments = [], isLoading: expiringDocumentsLoading } = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: () => getExpiringDocuments(30), // Documents expiring in next 30 days
    enabled: true
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!fileUpload || !selectedProperty || !selectedFolder) return null;
      
      return uploadPropertyDocument(
        selectedProperty.id,
        fileUpload,
        documentType,
        documentName || fileUpload.name,
        documentDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      setUploadDialogOpen(false);
      resetUploadForm();
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    }
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      });
    }
  });

  // Reset form values
  const resetUploadForm = () => {
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
    setDocumentType('lease');
  };

  // Handle property selection
  const handlePropertySelect = (propertyId: string, properties: Property[]) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedProperty(property || null);
    setSelectedFolder(null);
  };

  // Handle folder selection
  const handleFolderSelect = (folder: DocumentFolder) => {
    setSelectedFolder(folder);
    setDocumentType(folder.type);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (!fileUpload) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return;
    }
    
    uploadMutation.mutate();
  };

  // Handle download
  const handleDownload = (document: PropertyDocument) => {
    downloadDocument(document.filePath, document.id);
  };

  // Handle delete
  const handleDelete = (document: PropertyDocument) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      deleteMutation.mutate({ id: document.id, filePath: document.filePath });
    }
  };

  // Filter documents based on search query
  const getFilteredDocuments = () => {
    return searchQuery 
      ? documents.filter(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : documents;
  };

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
    selectedProperty,
    selectedFolder,
    searchQuery,
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    setUploadDialogOpen,
    documents,
    documentsLoading,
    recentDocuments,
    recentDocumentsLoading,
    expiringDocuments,
    expiringDocumentsLoading,
    uploadMutation,
    deleteMutation,
    resetUploadForm,
    handlePropertySelect,
    handleFolderSelect,
    handleFileSelect,
    handleUpload,
    handleDownload,
    handleDelete,
    setSearchQuery,
    setDocumentType,
    getFilteredDocuments,
    getDocumentsByType,
    setDocumentName,
    setDocumentDescription,
    refetchDocuments,
    fetchProperties,
    recordDocumentAccess
  };
};
