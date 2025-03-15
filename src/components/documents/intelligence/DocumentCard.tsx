
import React from 'react';
import { PropertyDocument } from '@/types/property';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Import our new components
import DocumentPreviewImage from './card/DocumentPreviewImage';
import DocumentCardActions from './card/DocumentCardActions';
import DocumentTagList from './card/DocumentTagList';
import FavoriteButton from './card/FavoriteButton';
import DocumentMetadata from './card/DocumentMetadata';

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
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base line-clamp-1">{document.name}</CardTitle>
            <DocumentMetadata 
              uploadDate={document.uploadDate}
              version={document.version}
              expiryDate={document.expiryDate}
            />
          </div>
          <FavoriteButton 
            document={document} 
            onToggleFavorite={onToggleFavorite} 
          />
        </div>
        <DocumentTagList tags={document.tags} />
      </CardHeader>
      
      <CardContent className="flex-grow">
        <DocumentPreviewImage 
          isImage={isImage}
          isPdf={isPdf}
          filePath={document.filePath}
          name={document.name}
        />
        
        {document.description && (
          <p className="text-sm mt-3 text-muted-foreground line-clamp-2">
            {document.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 justify-end">
        <DocumentCardActions 
          document={document}
          onDownload={onDownload}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewHistory={onViewHistory}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
