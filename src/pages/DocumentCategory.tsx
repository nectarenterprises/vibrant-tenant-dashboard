
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProperties } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentQueries } from '@/hooks/documents/useDocumentQueries';
import { useDocumentMutations } from '@/hooks/documents/useDocumentMutations';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { FolderType } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';
import { downloadDocument } from '@/services/document';
import { updateDocumentAccessTimestamp } from '@/services/FileStorageService';
import DocumentList from '@/components/documents/DocumentList';
import UploadDialog from '@/components/documents/UploadDialog';
import { getFolderTypeMap } from '@/services/document/folders';

const DocumentCategory = () => {
  const { propertyId, category } = useParams<{ propertyId: string, category: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Validate category
  const folderTypeMap = getFolderTypeMap();
  const validCategory = Object.keys(folderTypeMap).includes(category || '');
  const categoryName = category ? folderTypeMap[category as FolderType] : '';
  
  // Fetch properties to get the property name
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  const property = properties.find(p => p.id === propertyId);
  
  // Document queries
  const {
    documents,
    documentsLoading,
    refetchDocuments
  } = useDocumentQueries(
    propertyId,
    category as FolderType
  );
  
  // Document upload state
  const {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    isUploading,
    additionalMetadata,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    setIsUploading,
    setAdditionalMetadata,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  } = useDocumentUpload();
  
  // Document mutations
  const {
    uploadMutation,
    deleteMutation
  } = useDocumentMutations(
    propertyId,
    resetUploadForm
  );
  
  // Initialize form with the current category
  useEffect(() => {
    if (category) {
      setDocumentType(category as FolderType);
    }
  }, [category, setDocumentType]);
  
  // Handle document upload
  const handleUpload = () => {
    const uploadData = prepareUpload();
    if (uploadData) {
      // Use our enhanced upload mutation with additional metadata
      uploadMutation.mutate({
        file: uploadData.file,
        name: uploadData.name,
        type: uploadData.documentType,
        description: uploadData.description,
        additionalMetadata
      });
    }
  };
  
  // Redirect if invalid category or property ID
  useEffect(() => {
    if (!validCategory || !propertyId) {
      navigate('/documents');
    }
  }, [validCategory, propertyId, navigate]);
  
  // Handle document download
  const handleDownload = async (document: any) => {
    try {
      await downloadDocument(document.filePath, document.name);
      // Record access
      await updateDocumentAccessTimestamp(document.id);
      
      toast({
        title: "Document downloaded",
        description: `${document.name} has been downloaded successfully.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document."
      });
    }
  };
  
  // Handle document deletion
  const handleDelete = (document: any) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      deleteMutation.mutate({ 
        id: document.id, 
        filePath: document.filePath 
      });
    }
  };
  
  // Filter documents based on search query
  const filteredDocuments = searchQuery 
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : documents;
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <button 
              onClick={() => navigate(`/documents`)}
              className="text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors mb-2"
            >
              ← Back to documents
            </button>
            <h1 className="text-3xl font-bold">{property?.name} - {categoryName}</h1>
          </div>
          
          <DocumentList 
            documents={filteredDocuments}
            isLoading={documentsLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUploadClick={() => setUploadDialogOpen(true)}
            onRefresh={refetchDocuments}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
          
          <UploadDialog
            isOpen={uploadDialogOpen}
            setIsOpen={setUploadDialogOpen}
            fileUpload={fileUpload}
            documentName={documentName}
            documentDescription={documentDescription}
            documentType={documentType}
            isUploading={uploadMutation.isPending}
            onFileSelect={handleFileSelect}
            onNameChange={setDocumentName}
            onDescriptionChange={setDocumentDescription}
            onTypeChange={setDocumentType}
            onUpload={handleUpload}
            additionalMetadata={additionalMetadata}
            onAdditionalMetadataChange={setAdditionalMetadata}
          />
        </div>
      </main>
    </div>
  );
};

export default DocumentCategory;
