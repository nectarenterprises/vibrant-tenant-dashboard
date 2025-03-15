
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, X } from 'lucide-react';
import { DocumentTag } from '@/types/property';

interface TagSelectorProps {
  selectedTags: DocumentTag[];
  availableTags: DocumentTag[];
  toggleTag: (tag: DocumentTag) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  toggleTag
}) => {
  return (
    <div className="grid gap-2">
      <Label>Tags (Optional)</Label>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id}
            className="flex items-center gap-1"
            style={{ 
              backgroundColor: tag.color,
              color: 'white'
            }}
          >
            {tag.name}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => toggleTag(tag)}
            />
          </Badge>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="space-y-2">
              {availableTags
                .filter(tag => !selectedTags.some(t => t.id === tag.id))
                .map(tag => (
                  <Badge
                    key={tag.id}
                    className="cursor-pointer mr-1 mb-1"
                    style={{ 
                      backgroundColor: tag.color,
                      color: 'white'
                    }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              
              {availableTags.length === selectedTags.length && (
                <p className="text-sm text-muted-foreground">No more tags available</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagSelector;
