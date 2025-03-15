
import { useState } from 'react';
import { Property, PropertyDocument } from '@/types/property';
import { DocumentFolder, FolderType } from '@/services/document/types';
import { downloadDocument, recordDocumentAccess } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

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
  const getFilteredDocuments = (documents: PropertyDocument[] = []) => {
    if (!documents || documents.length === 0) return [];
    
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
  const handleDownload = async (document: PropertyDocument) => {
    try {
      await downloadDocument(document.filePath, document.name);
      // Record access after successful download
      if (document.id) {
        await recordDocumentAccess(document.id);
      }
      
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
