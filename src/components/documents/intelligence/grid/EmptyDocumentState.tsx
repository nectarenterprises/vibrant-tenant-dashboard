
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentStateProps {
  onUploadClick: () => void;
}

const EmptyDocumentState: React.FC<EmptyDocumentStateProps> = ({ onUploadClick }) => {
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
};

export default EmptyDocumentState;
