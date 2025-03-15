
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import { Property, PropertyDocument } from '@/types/property';
import { cn } from '@/lib/utils';
import { FolderType } from '@/services/document/types';
import { getPropertyDocuments, downloadDocument, deleteDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';
import UploadDialog from '@/components/documents/UploadDialog';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProperties } from '@/services/property';
import PropertySearch from '@/components/utilities/PropertySearch';
import PropertyGrid from '@/components/utilities/PropertyGrid';
import PropertyUtilityDetails from '@/components/utilities/PropertyUtilityDetails';

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
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
      const documents = await getPropertyDocuments(propertyId, documentType);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileUpload || !selectedProperty) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a file to upload.",
      });
      return;
    }

    setUploadDialogOpen(false);
    toast({
      title: "Upload functionality",
      description: "Full upload functionality would be implemented here.",
    });
    
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">Utilities Dashboard</h1>
            <p className="text-muted-foreground">Monitor your property's utility usage and costs</p>
          </div>
          
          {!selectedProperty && (
            <PropertySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}

          {selectedProperty ? (
            <PropertyUtilityDetails 
              property={selectedProperty}
              utilityDocuments={utilityDocuments}
              documentsLoading={documentsLoading}
              documentType={documentType}
              onBack={() => setSelectedProperty(null)}
              onUploadClick={() => setUploadDialogOpen(true)}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PropertyGrid
                filteredProperties={filteredProperties}
                propertiesLoading={propertiesLoading}
                searchQuery={searchQuery}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          )}
        </div>
      </main>
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        setIsOpen={setUploadDialogOpen}
        fileUpload={fileUpload}
        documentName={documentName}
        documentDescription={documentDescription}
        documentType={documentType}
        isUploading={false}
        onFileSelect={handleFileSelect}
        onNameChange={setDocumentName}
        onDescriptionChange={setDocumentDescription}
        onTypeChange={setDocumentType}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Utilities;
