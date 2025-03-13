
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

interface DocumentSectionHeaderProps {
  hasDocuments: boolean;
  expanded: boolean;
  toggleExpand: () => void;
  onAddDocument: () => void;
}

const DocumentSectionHeader: React.FC<DocumentSectionHeaderProps> = ({
  hasDocuments,
  expanded,
  toggleExpand,
  onAddDocument
}) => {
  return (
    <div className="pb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Documents</CardTitle>
      <div className="flex items-center space-x-1">
        {hasDocuments && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleExpand}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onAddDocument}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentSectionHeader;
