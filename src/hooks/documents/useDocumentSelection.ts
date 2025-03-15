
import { useState } from 'react';
import { Property } from '@/types/property';
import { DocumentFolder, FolderType } from '@/services/document/types';
import { downloadDocument, recordDocumentAccess } from '@/services/document';
import { PropertyDocument } from '@/types/property';

/**
 * Hook for handling document and property selection
 */
export const useDocumentSelection = () => {
  // Property and folder selection
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter documents based on search query
  const getFilteredDocuments = (documents: PropertyDocument[]) => {
    return searchQuery 
      ? documents.filter(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : documents;
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
  };

  // Handle document download
  const handleDownload = (document: PropertyDocument) => {
    downloadDocument(document.filePath, document.id);
  };

  return {
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
  };
};
