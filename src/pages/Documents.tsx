
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import { DocumentsContainer } from '@/components/documents/DocumentsContainer';
import { usePropertyDocuments } from '@/hooks/documents/usePropertyDocuments';
import { Property } from '@/types/property';
import DocumentSearch from '@/components/documents/DocumentSearch';
import SidebarSelectors from '@/components/documents/SidebarSelectors';
import { FolderType } from '@/services/document/types';

const Documents = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  
  // Use the custom hook
  const {
    selectedProperty,
    selectedFolder,
    searchQuery,
    documents,
    documentsLoading,
    uploadDialogOpen,
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadMutation,
    setSearchQuery,
    handlePropertySelect,
    handleFolderSelect,
    getFilteredDocuments,
    handleDownload,
    handleDelete,
    refetchDocuments,
    setUploadDialogOpen,
    handleFileSelect,
    setDocumentName,
    setDocumentDescription,
    setDocumentType
  } = usePropertyDocuments();

  // Fetch properties
  const { 
    data: properties = [], 
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: () => {
      if (!user) return [];
      return fetchUserProperties();
    },
    enabled: !!user
  });

  // Handle upload
  const handleUpload = async () => {
    if (!fileUpload || !selectedProperty || !selectedFolder) return;
    
    uploadMutation.mutate({
      file: fileUpload,
      name: documentName,
      description: documentDescription,
      documentType: selectedFolder.type as FolderType
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className={cn(
        "flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="w-full lg:w-1/4">
                <SidebarSelectors
                  properties={properties}
                  propertiesLoading={propertiesLoading}
                  selectedProperty={selectedProperty}
                  selectedFolder={selectedFolder}
                  onPropertySelect={(propertyId) => handlePropertySelect(propertyId, properties)}
                  onFolderSelect={handleFolderSelect}
                />
              </div>
              
              <div className="w-full lg:w-3/4">
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
                  documentType={documentType as FolderType}
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
                  getFilteredDocuments={getFilteredDocuments}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
