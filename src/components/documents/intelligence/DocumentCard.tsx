
import React from 'react';
import { format } from 'date-fns';
import { PropertyDocument, DocumentTag } from '@/types/property';
import { 
  FileText, 
  Download, 
  Trash2, 
  Star, 
  Edit, 
  Clock, 
  Calendar,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DocumentCardProps {
  document: PropertyDocument;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
  onEdit: (document: PropertyDocument) => void;
  onToggleFavorite: (document: PropertyDocument, isFavorite: boolean) => void;
  onViewHistory: (document: PropertyDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onDelete,
  onEdit,
  onToggleFavorite,
  onViewHistory
}) => {
  const fileExtension = document.filePath.split('.').pop()?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';
  
  const renderTags = () => {
    if (!document.tags || document.tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {document.tags.map((tag: DocumentTag) => (
          <Badge 
            key={tag.id} 
            variant="outline"
            style={{ 
              borderColor: tag.color,
              color: tag.color
            }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base line-clamp-1">{document.name}</CardTitle>
            <CardDescription className="text-xs flex items-center mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              {format(new Date(document.uploadDate), 'PPP')}
              {document.version && document.version > 1 && (
                <Badge variant="outline" className="ml-2 text-xs">v{document.version}</Badge>
              )}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={document.isFavorite ? "text-yellow-500" : "text-muted-foreground"}
                  onClick={() => onToggleFavorite(document, !document.isFavorite)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {document.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {renderTags()}
      </CardHeader>
      
      <CardContent className="flex-grow">
        {isImage ? (
          <div className="relative h-32 w-full bg-muted rounded-md overflow-hidden">
            <img
              src={`https://bzlzfdolanyeoqmxmwxp.supabase.co/storage/v1/object/public/documents/${document.filePath}`}
              alt={document.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-muted rounded-md">
            <FileText className="h-12 w-12 text-primary opacity-70" />
          </div>
        )}
        
        {document.description && (
          <p className="text-sm mt-3 text-muted-foreground line-clamp-2">
            {document.description}
          </p>
        )}
        
        {document.expiryDate && (
          <div className="mt-3 text-xs flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Expires: </span>
            <span className="font-medium ml-1">
              {format(new Date(document.expiryDate), 'PPP')}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 justify-end">
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
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
