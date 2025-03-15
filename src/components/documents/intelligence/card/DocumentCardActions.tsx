
import React from 'react';
import { Download, Trash2, Edit, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyDocument } from '@/types/property';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DocumentCardActionsProps {
  document: PropertyDocument;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
  onEdit: (document: PropertyDocument) => void;
  onViewHistory: (document: PropertyDocument) => void;
}

const DocumentCardActions: React.FC<DocumentCardActionsProps> = ({
  document,
  onDownload,
  onDelete,
  onEdit,
  onViewHistory
}) => {
  return (
    <div className="flex space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onViewHistory(document)}
            >
              <History className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View version history</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(document)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit document details</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDownload(document)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download document</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(document)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete document</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DocumentCardActions;
