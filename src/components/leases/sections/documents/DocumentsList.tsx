
import React from 'react';
import { PropertyDocument } from '@/types/property';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DocumentCard from './DocumentCard';

interface DocumentsListProps {
  documents: PropertyDocument[];
  expanded: boolean;
  toggleExpand: () => void;
  handleDownload: (document: PropertyDocument) => void;
  handleDelete: (document: PropertyDocument) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  expanded,
  toggleExpand,
  handleDownload,
  handleDelete
}) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {!expanded ? (
        <DocumentCard 
          document={documents[0]} 
          onDownload={handleDownload} 
          onDelete={handleDelete} 
        />
      ) : (
        documents.map((document) => (
          <DocumentCard 
            key={document.id} 
            document={document} 
            onDownload={handleDownload} 
            onDelete={handleDelete} 
          />
        ))
      )}
      
      <div className="flex justify-center mt-2">
        {documents.length > 1 && !expanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand}
            className="text-xs"
          >
            View all {documents.length} documents
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        )}
        {expanded && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand}
            className="text-xs"
          >
            Collapse
            <ChevronUp className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentsList;
