
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FolderType, DOCUMENT_TYPES } from '@/services/document/types';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DocumentFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    documentType?: FolderType;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
  }) => void;
  availableTags: { id: string; name: string; color: string }[];
}

const DocumentFilterDialog: React.FC<DocumentFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  availableTags
}) => {
  const [documentType, setDocumentType] = useState<FolderType | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const handleApply = () => {
    onApplyFilters({
      documentType,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      startDate,
      endDate
    });
    onClose();
  };
  
  const handleReset = () => {
    setDocumentType(undefined);
    setSelectedTags([]);
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Document Type Filter */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as FolderType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All document types" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tags Filter */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  style={{ 
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                    borderColor: tag.color,
                    color: selectedTags.includes(tag.id) ? 'white' : 'inherit'
                  }}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                  {selectedTags.includes(tag.id) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
              {availableTags.length === 0 && (
                <div className="text-sm text-muted-foreground">No tags available</div>
              )}
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentFilterDialog;
