
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Property, PropertyDocument } from '@/types/property';
import { DocumentFolder, FolderType } from '@/services/document/types';
import DocumentList from './DocumentList';
import UploadDialog from './UploadDialog';
import EmptyState from './EmptyState';
import { UseMutationResult } from '@tanstack/react-query';

interface DocumentsContainerProps {
  selectedProperty: Property | null;
  selectedFolder: DocumentFolder | null;
  searchQuery: string;
  documents: PropertyDocument[];
  documentsLoading: boolean;
  uploadDialogOpen: boolean;
  fileUpload: File | null;
  documentName: string;
  documentDescription: string;
  documentType: FolderType;
  uploadMutation: UseMutationResult<any, Error, any, unknown>;
  setSearchQuery: (query: string) => void;
  setUploadDialogOpen: (open: boolean) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  handleDownload: (document: PropertyDocument) => void;
  handleDelete: (document: PropertyDocument) => void;
  refetchDocuments: () => void;
  setDocumentName: (name: string) => void;
  setDocumentDescription: (description: string) => void;
  setDocumentType: (type: FolderType) => void;
  getFilteredDocuments: () => PropertyDocument[];
}

const DocumentsContainer = ({
  selectedProperty,
  selectedFolder,
  searchQuery,
  documentsLoading,
  uploadDialogOpen,
  fileUpload,
  documentName,
  documentDescription,
  documentType,
  uploadMutation,
  setSearchQuery,
  setUploadDialogOpen,
  handleFileSelect,
  handleUpload,
  handleDownload,
  handleDelete,
  refetchDocuments,
  setDocumentName,
  setDocumentDescription,
  setDocumentType,
  getFilteredDocuments
}: DocumentsContainerProps) => {

  // Get filtered documents based on search query
  const filteredDocuments = getFilteredDocuments();

  if (!selectedProperty) {
    return <EmptyState type="property" />;
  }

  if (!selectedFolder) {
    return <EmptyState type="folder" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedProperty.name} - {selectedFolder.name}</CardTitle>
        <CardDescription>Manage your property documents</CardDescription>
      </CardHeader>
      
      <CardContent>
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
        
        <UploadDialog
          isOpen={uploadDialogOpen}
          setIsOpen={setUploadDialogOpen}
          fileUpload={fileUpload}
          documentName={documentName}
          documentDescription={documentDescription}
          documentType={documentType}
          isUploading={uploadMutation.isPending}
          onFileSelect={handleFileSelect}
          onNameChange={setDocumentName}
          onDescriptionChange={setDocumentDescription}
          onTypeChange={setDocumentType}
          onUpload={handleUpload}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsContainer;
