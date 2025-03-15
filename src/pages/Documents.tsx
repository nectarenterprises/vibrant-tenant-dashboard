
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { getPropertyFolderStructure } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyDocument } from '@/services/document/fileUpload';
import { deleteDocument } from '@/services/document';

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
    documents,
    documentsLoading,
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    uploadDialogOpen,
    setUploadDialogOpen,
    uploadMutation,
    handlePropertySelect,
    handleFolderSelect,
    handleFileSelect,
    handleDownload,
    handleDelete,
    setSearchQuery,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    getFilteredDocuments,
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

  // Handle document upload
  const handleUpload = async () => {
    if (!fileUpload || !selectedProperty || !selectedFolder) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a property, folder, and file to upload.",
      });
      return;
    }

    try {
      const uploaded = await uploadPropertyDocument(
        selectedProperty.id,
        fileUpload,
        selectedFolder.type,
        documentName,
        documentDescription
      );

      if (uploaded) {
        toast({
          title: "Document uploaded",
          description: `${documentName} has been uploaded successfully.`,
        });
        
        // Reset form and refresh document list
        setDocumentName('');
        setDocumentDescription('');
        setFileUpload(null);
        setUploadDialogOpen(false);
        refetchDocuments();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your document.",
      });
    }
  };

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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">Document Management</h1>
          
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
                documents={documents}
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
                getFilteredDocuments={getFilteredDocuments}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
