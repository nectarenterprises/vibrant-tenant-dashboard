
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

interface EmptyDocumentStateProps {
  onUploadClick: () => void;
}

const EmptyDocumentState: React.FC<EmptyDocumentStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <FileText className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
      <p className="text-muted-foreground">No documents uploaded</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={onUploadClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
};

export default EmptyDocumentState;
