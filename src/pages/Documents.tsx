
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { DocumentFolder } from '@/services/document/types';
import { fetchProperties } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentSelection } from '@/hooks/documents/useDocumentSelection';
import { useDocumentQueries } from '@/hooks/documents/useDocumentQueries';
import { useDocumentMutations } from '@/hooks/documents/useDocumentMutations';
import DocumentsContainer from '@/components/documents/DocumentsContainer';
import SidebarSelectors from '@/components/documents/SidebarSelectors';
import { toast } from '@/components/ui/use-toast';

const Documents = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Document selection state
  const {
    selectedProperty,
    selectedFolder,
    selectProperty,
    selectFolder,
  } = useDocumentSelection();
  
  // Fetch properties
  const { 
    data: properties = [], 
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    enabled: !!user
  });
  
  // Document queries - fetch documents based on selected property and folder
  const {
    documents,
    documentsLoading,
    refetchDocuments
  } = useDocumentQueries(selectedProperty?.id, selectedFolder);
  
  // Document mutations - handle document uploads, downloads, and deletes
  const {
    uploadDocument,
    downloadDocument,
    deleteDocument,
    isUploading
  } = useDocumentMutations(selectedProperty?.id, refetchDocuments);
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle property selection
  const handlePropertySelect = (propertyId: string) => {
    const selected = properties.find(p => p.id === propertyId) || null;
    selectProperty(selected);
  };
  
  // Reset selection if properties change
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      selectProperty(properties[0]);
    }
  }, [properties, selectedProperty, selectProperty]);
  
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
          propertiesLoading={propertiesLoading}
          selectedProperty={selectedProperty}
          selectedFolder={selectedFolder}
          handlePropertySelect={handlePropertySelect}
          handleFolderSelect={selectFolder}
        />
      </div>
      
      <div className="flex-1 ml-64">
        <div className="container mx-auto p-6">
          <DocumentsContainer
            documents={filteredDocuments}
            documentsLoading={documentsLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedProperty={selectedProperty}
            selectedFolder={selectedFolder}
            uploadDocument={uploadDocument}
            downloadDocument={downloadDocument}
            deleteDocument={deleteDocument}
            isUploading={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default Documents;
