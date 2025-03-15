
import React from 'react';
import { PropertyDocument } from '@/types/property';
import LoadingState from './grid/LoadingState';
import EmptyDocumentState from './grid/EmptyDocumentState';
import DocumentsGridLayout from './grid/DocumentsGridLayout';

interface DocumentGridProps {
  documents: PropertyDocument[];
  isLoading: boolean;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
  onEdit: (document: PropertyDocument) => void;
  onToggleFavorite: (document: PropertyDocument, isFavorite: boolean) => void;
  onViewHistory: (document: PropertyDocument) => void;
  onUploadClick: () => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  isLoading,
  onDownload,
  onDelete,
  onEdit,
  onToggleFavorite,
  onViewHistory,
  onUploadClick
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (documents.length === 0) {
    return <EmptyDocumentState onUploadClick={onUploadClick} />;
  }
  
  return (
    <DocumentsGridLayout
      documents={documents}
      onDownload={onDownload}
      onDelete={onDelete}
      onEdit={onEdit}
      onToggleFavorite={onToggleFavorite}
      onViewHistory={onViewHistory}
    />
  );
};

export default DocumentGrid;
