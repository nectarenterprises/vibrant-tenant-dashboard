import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { Property, PropertyDocument } from '@/types/property';
import { cn } from '@/lib/utils';
import { FolderType } from '@/services/document/types';
import { getPropertyDocuments, downloadDocument, deleteDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertyUtilityDetails from '@/components/utilities/PropertyUtilityDetails';
import UtilitiesHeader from '@/components/utilities/UtilitiesHeader';
import PropertyDisplay from '@/components/utilities/PropertyDisplay';
import UtilityUpload from '@/components/utilities/UtilityUpload';

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentType, setDocumentType] = useState<FolderType>('utility');
  const { user } = useAuth();
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: fetchUserProperties,
    enabled: !!user?.id
  });
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedProperty) {
      fetchUtilityDocuments(selectedProperty.id);
    }
  }, [selectedProperty]);

  const fetchUtilityDocuments = async (propertyId: string) => {
    setDocumentsLoading(true);
    try {
      const documents = await getPropertyDocuments(propertyId, documentType as DocumentType);
      setUtilityDocuments(documents);
    } catch (error) {
      console.error('Error fetching utility documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch utility documents.",
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDownload = async (document: PropertyDocument) => {
    try {
      await downloadDocument(document.filePath);
      toast({
        title: "Download started",
        description: `${document.name} is being downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document.",
      });
    }
  };

  const handleDelete = async (document: PropertyDocument) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) return;
    
    try {
      const success = await deleteDocument(document.id, document.filePath);
      if (success) {
        setUtilityDocuments(docs => docs.filter(d => d.id !== document.id));
        toast({
          title: "Document deleted",
          description: `${document.name} has been deleted.`,
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the document.",
      });
    }
  };

  const refetchDocuments = () => {
    if (selectedProperty) {
      fetchUtilityDocuments(selectedProperty.id);
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
          <UtilitiesHeader />
          
          {!selectedProperty && (
            <PropertyDisplay 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProperties={filteredProperties}
              propertiesLoading={propertiesLoading}
              onPropertySelect={setSelectedProperty}
            />
          )}

          {selectedProperty && (
            <PropertyUtilityDetails 
              property={selectedProperty}
              utilityDocuments={utilityDocuments}
              documentsLoading={documentsLoading}
              documentType={documentType}
              onBack={() => setSelectedProperty(null)}
              onUploadClick={() => document.getElementById('utility-upload-trigger')?.click()}
              onDownload={handleDownload}
              onDelete={handleDelete}
              refetchDocuments={refetchDocuments}
            />
          )}
        </div>
      </main>
      
      <UtilityUpload 
        selectedProperty={selectedProperty} 
        onUploadComplete={refetchDocuments} 
      />
    </div>
  );
};

export default Utilities;
