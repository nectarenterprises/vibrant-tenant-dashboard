
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PropertyDocument } from '@/types/property';

interface FavoriteButtonProps {
  document: PropertyDocument;
  onToggleFavorite: (document: PropertyDocument, isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  document,
  onToggleFavorite
}) => {
  return (
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
  );
};

export default FavoriteButton;
