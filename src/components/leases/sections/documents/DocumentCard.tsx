
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2 } from 'lucide-react';
import { PropertyDocument } from '@/types/property';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: PropertyDocument;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <p className="font-medium">{document.name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(document.uploadDate), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDownload(document)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(document)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentCard;
