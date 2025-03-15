import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { getPropertyFolderStructure } from '@/services/document/types';

// Import custom hooks
import { usePropertyDocuments } from '@/hooks/documents/usePropertyDocuments';

// Import refactored components
import SidebarSelectors from '@/components/documents/SidebarSelectors';
import DocumentsContainer from '@/components/documents/DocumentsContainer';

const Documents = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  
  const {
    selectedProperty,
    selectedFolder,
    searchQuery,
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    setUploadDialogOpen,
    documentsLoading,
    uploadMutation,
    handlePropertySelect,
    handleFolderSelect,
    handleFileSelect,
    handleUpload,
    handleDownload,
    handleDelete,
    setSearchQuery,
    setDocumentType,
    getFilteredDocuments: getFilteredDocumentsFn,
    setDocumentName,
    setDocumentDescription,
    refetchDocuments,
    fetchProperties
  } = usePropertyDocuments();

  // Get filtered documents based on search query
  const getFilteredDocumentsWrapper = () => {
    if (!selectedProperty || !selectedFolder) {
      return [];
    }
    return getFilteredDocumentsFn();
  };

  // Query to fetch properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: () => fetchProperties(user?.id || ''),
    enabled: !!user?.id
  });

  // Get folder structure for selected property
  const folderStructure = selectedProperty 
    ? getPropertyFolderStructure(selectedProperty.id)
    : [];

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
          <h1 className="text-3xl font-bold mb-6">Document Management</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <SidebarSelectors 
                properties={properties}
                selectedProperty={selectedProperty}
                folderStructure={folderStructure}
                selectedFolder={selectedFolder}
                propertiesLoading={propertiesLoading}
                handlePropertySelect={handlePropertySelect}
                handleFolderSelect={handleFolderSelect}
              />
            </div>
            
            <div className="md:col-span-9">
              <DocumentsContainer
                selectedProperty={selectedProperty}
                selectedFolder={selectedFolder}
                searchQuery={searchQuery}
                documents={[]} // This is unused since we use getFilteredDocuments directly 
                documentsLoading={documentsLoading}
                uploadDialogOpen={uploadDialogOpen}
                fileUpload={fileUpload}
                documentName={documentName}
                documentDescription={documentDescription}
                documentType={documentType}
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
                getFilteredDocuments={getFilteredDocumentsWrapper}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
