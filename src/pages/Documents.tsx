
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { DocumentFolder } from '@/services/document/types';
import { fetchUserProperties } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentSelection } from '@/hooks/documents/useDocumentSelection';
import { useDocumentQueries } from '@/hooks/documents/useDocumentQueries';
import { useDocumentMutations } from '@/hooks/documents/useDocumentMutations';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import DocumentsContainer from '@/components/documents/DocumentsContainer';
import SidebarSelectors from '@/components/documents/SidebarSelectors';
import { getPropertyFolderStructure } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';
import { downloadDocument } from '@/services/document';

const Documents = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Document selection state
  const {
    selectedProperty,
    selectedFolder,
    setSelectedProperty,
    setSelectedFolder,
    getFilteredDocuments,
    handlePropertySelect,
    handleFolderSelect,
    handleDownload,
    recordDocumentAccess
  } = useDocumentSelection();
  
  // Fetch properties
  const { 
    data: properties = [], 
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchUserProperties,
    enabled: !!user
  });
  
  // Get folder structure for selected property
  const folderStructure = selectedProperty 
    ? getPropertyFolderStructure(selectedProperty.id) 
    : [];
  
  // Document queries - fetch documents based on selected property and folder
  const {
    documents,
    documentsLoading,
    refetchDocuments
  } = useDocumentQueries(
    selectedProperty?.id, 
    selectedFolder?.type
  );

  // Document upload state
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
  
  // Document mutations - handle document uploads, downloads, and deletes
  const {
    uploadMutation,
    deleteMutation
  } = useDocumentMutations(
    selectedProperty?.id,
    resetUploadForm
  );
  
  // Handle document upload
  const handleUpload = () => {
    const uploadData = prepareUpload();
    if (uploadData) {
      uploadMutation.mutate(uploadData);
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
  
  // Reset selection if properties change
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  }, [properties, selectedProperty, setSelectedProperty]);
  
  // If not logged in, show login message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your documents</h1>
        <p>You need to be logged in to access your property documents.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-border bg-background z-10 overflow-auto">
        <SidebarSelectors
          properties={properties}
          selectedProperty={selectedProperty}
          folderStructure={folderStructure}
          selectedFolder={selectedFolder}
          propertiesLoading={propertiesLoading}
          handlePropertySelect={(propertyId) => handlePropertySelect(propertyId, properties)}
          handleFolderSelect={handleFolderSelect}
        />
      </div>
      
      <div className="flex-1 ml-64">
        <div className="container mx-auto p-6">
          <DocumentsContainer
            selectedProperty={selectedProperty}
            selectedFolder={selectedFolder}
            searchQuery={searchQuery}
            documents={documents}
            documentsLoading={documentsLoading}
            uploadDialogOpen={uploadDialogOpen}
            fileUpload={fileUpload}
            documentName={documentName}
            documentDescription={documentDescription}
            documentType={selectedFolder?.type || 'lease'}
            uploadMutation={uploadMutation}
            setSearchQuery={setSearchQuery}
            setUploadDialogOpen={setUploadDialogOpen}
            handleFileSelect={handleFileSelect}
            handleUpload={handleUpload}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
            refetchDocuments={refetchDocuments}
            setDocumentName={setDocumentName}
            setDocumentDescription={setDocumentDescription}
            setDocumentType={setDocumentType}
            getFilteredDocuments={() => getFilteredDocuments(documents)}
          />
        </div>
      </div>
    </div>
  );
};

export default Documents;
