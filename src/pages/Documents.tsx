
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getPropertyFolderStructure } from '@/services/document/folders';

// Import custom components
import PropertySelector from '@/components/documents/PropertySelector';
import FolderSelector from '@/components/documents/FolderSelector';
import DocumentList from '@/components/documents/DocumentList';
import UploadDialog from '@/components/documents/UploadDialog';
import EmptyState from '@/components/documents/EmptyState';
import { usePropertyDocuments } from '@/hooks/documents/usePropertyDocuments';

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
    uploadDialogOpen,
    setUploadDialogOpen,
    documentsLoading,
    handlePropertySelect,
    handleFolderSelect,
    handleFileSelect,
    handleUpload,
    handleDownload,
    handleDelete,
    setSearchQuery,
    getFilteredDocuments,
    setDocumentName,
    setDocumentDescription,
    refetchDocuments,
    fetchProperties
  } = usePropertyDocuments();

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

  // Get filtered documents based on search query
  const filteredDocuments = getFilteredDocuments();

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
            <div className="md:col-span-3 space-y-6">
              {/* Property Selector */}
              <PropertySelector
                properties={properties}
                selectedProperty={selectedProperty}
                isLoading={propertiesLoading}
                onSelectProperty={(propertyId) => handlePropertySelect(propertyId, properties)}
              />
              
              {/* Folder Selector (only show if property is selected) */}
              {selectedProperty && (
                <FolderSelector
                  folders={folderStructure}
                  selectedFolder={selectedFolder}
                  onSelectFolder={handleFolderSelect}
                />
              )}
            </div>
            
            <div className="md:col-span-9">
              {!selectedProperty ? (
                <EmptyState type="property" />
              ) : !selectedFolder ? (
                <EmptyState type="folder" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedProperty.name} - {selectedFolder.name}</CardTitle>
                    <CardDescription>Manage your property documents</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Document List Component */}
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
                    
                    {/* Upload Dialog */}
                    <UploadDialog
                      isOpen={uploadDialogOpen}
                      setIsOpen={setUploadDialogOpen}
                      fileUpload={fileUpload}
                      documentName={documentName}
                      documentDescription={documentDescription}
                      isUploading={false}
                      onFileSelect={handleFileSelect}
                      onNameChange={setDocumentName}
                      onDescriptionChange={setDocumentDescription}
                      onUpload={handleUpload}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
