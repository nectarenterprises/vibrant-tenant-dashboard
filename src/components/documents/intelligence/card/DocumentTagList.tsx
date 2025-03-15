
import React from 'react';
import { DocumentTag } from '@/types/property';
import { Badge } from '@/components/ui/badge';

interface DocumentTagListProps {
  tags: DocumentTag[] | undefined;
}

const DocumentTagList: React.FC<DocumentTagListProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag: DocumentTag) => (
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

export default DocumentTagList;
