
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentMetadataProps {
  uploadDate: string;
  version?: number;
  description?: string;
  expiryDate?: string;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({
  uploadDate,
  version,
  description,
  expiryDate
}) => {
  return (
    <>
      <div className="text-xs flex items-center mt-1">
        <Clock className="h-3 w-3 inline mr-1" />
        {format(new Date(uploadDate), 'PPP')}
        {version && version > 1 && (
          <Badge variant="outline" className="ml-2 text-xs">v{version}</Badge>
        )}
      </div>
      
      {description && (
        <p className="text-sm mt-3 text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}
      
      {expiryDate && (
        <div className="mt-3 text-xs flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">Expires: </span>
          <span className="font-medium ml-1">
            {format(new Date(expiryDate), 'PPP')}
          </span>
        </div>
      )}
    </>
  );
};

export default DocumentMetadata;
