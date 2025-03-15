
import React from 'react';
import { PropertyDocument } from '@/types/property';
import DocumentCard from './DocumentCard';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    return (
      <div className="flex items-center justify-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md border-dashed">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">No documents found</h3>
        <p className="text-muted-foreground mb-4">
          Upload your first document to get started
        </p>
        <Button onClick={onUploadClick}>
          Upload Document
        </Button>
      </div>
    );
  }
  
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

export default DocumentGrid;
