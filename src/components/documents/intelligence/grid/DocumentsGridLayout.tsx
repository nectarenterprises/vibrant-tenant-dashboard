
import React from 'react';
import { PropertyDocument } from '@/types/property';
import DocumentCard from '../DocumentCard';

interface DocumentsGridLayoutProps {
  documents: PropertyDocument[];
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
  onEdit: (document: PropertyDocument) => void;
  onToggleFavorite: (document: PropertyDocument, isFavorite: boolean) => void;
  onViewHistory: (document: PropertyDocument) => void;
}

const DocumentsGridLayout: React.FC<DocumentsGridLayoutProps> = ({
  documents,
  onDownload,
  onDelete,
  onEdit,
  onToggleFavorite,
  onViewHistory
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map(document => (
        <DocumentCard
          key={document.id}
          document={document}
          onDownload={onDownload}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
};

export default DocumentsGridLayout;
