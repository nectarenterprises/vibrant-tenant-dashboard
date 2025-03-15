
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PropertyDocument, DocumentTag } from '@/types/property';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DocumentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: PropertyDocument | null;
  onSave: (documentId: string, updates: {
    name: string;
    description: string;
    tags?: DocumentTag[];
    expiryDate?: string;
    keyDates?: PropertyDocument['keyDates'];
    notificationPeriod?: number;
  }) => void;
  availableTags: DocumentTag[];
}

const DocumentEditDialog: React.FC<DocumentEditDialogProps> = ({
  isOpen,
  onClose,
  document,
  onSave,
  availableTags
}) => {
  const [name, setName] = useState(document?.name || '');
  const [description, setDescription] = useState(document?.description || '');
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>(document?.tags || []);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    document?.expiryDate ? new Date(document.expiryDate) : undefined
  );
  const [commencementDate, setCommencementDate] = useState<Date | undefined>(
    document?.keyDates?.commencement ? new Date(document.keyDates.commencement) : undefined
  );
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | undefined>(
    document?.keyDates?.expiry ? new Date(document.keyDates.expiry) : undefined
  );
  const [notificationPeriod, setNotificationPeriod] = useState<number>(
    document?.notificationPeriod || 90
  );
  
  const handleSave = () => {
    if (!document || !name) return;
    
    const keyDates = {
      commencement: commencementDate?.toISOString(),
      expiry: leaseExpiryDate?.toISOString(),
      breakOption: document.keyDates?.breakOption || [],
      rentReview: document.keyDates?.rentReview || []
    };
    
    onSave(document.id, {
      name,
      description,
      tags: selectedTags,
      expiryDate: expiryDate?.toISOString(),
      keyDates,
      notificationPeriod
    });
    
    onClose();
  };
  
  const toggleTag = (tag: DocumentTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  if (!document) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="documentDescription">Description</Label>
            <Textarea
              id="documentDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Document Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expiryDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : <span>Set expiry date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notificationPeriod">Notification Period (days)</Label>
              <Input
                id="notificationPeriod"
                type="number"
                min={1}
                value={notificationPeriod}
                onChange={(e) => setNotificationPeriod(parseInt(e.target.value) || 90)}
              />
            </div>
          </div>
          
          <div className="grid gap-2 mt-2">
            <Label className="text-base font-medium">Lease Key Dates</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="commencementDate">Commencement Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="commencementDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !commencementDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {commencementDate ? format(commencementDate, "PPP") : <span>Set date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={commencementDate}
                      onSelect={setCommencementDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="leaseExpiryDate">Lease Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="leaseExpiryDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !leaseExpiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {leaseExpiryDate ? format(leaseExpiryDate, "PPP") : <span>Set date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={leaseExpiryDate}
                      onSelect={setLeaseExpiryDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentEditDialog;
