
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Upload, X, Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentTag } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { FolderType, DOCUMENT_TYPES } from '@/services/document/types';
import { cn } from '@/lib/utils';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    file: File, 
    documentType: FolderType, 
    name: string, 
    description: string,
    tags: DocumentTag[],
    expiryDate?: string,
    keyDates?: {
      commencement?: string;
      expiry?: string;
    },
    notificationPeriod?: number
  ) => Promise<void>;
  availableTags: DocumentTag[];
  isUploading: boolean;
  existingDocument?: { id: string } | null;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  availableTags,
  isUploading,
  existingDocument
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<FolderType>('lease');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [commencementDate, setCommencementDate] = useState<Date | undefined>(undefined);
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | undefined>(undefined);
  const [notificationPeriod, setNotificationPeriod] = useState<number>(90);
  const [versionNotes, setVersionNotes] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) {
        setName(e.target.files[0].name);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    const keyDates = {
      commencement: commencementDate?.toISOString(),
      expiry: leaseExpiryDate?.toISOString(),
    };
    
    await onUpload(
      file, 
      documentType, 
      name, 
      description,
      selectedTags,
      expiryDate?.toISOString(),
      keyDates,
      notificationPeriod
    );
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setFile(null);
    setDocumentType('lease');
    setName('');
    setDescription('');
    setSelectedTags([]);
    setExpiryDate(undefined);
    setCommencementDate(undefined);
    setLeaseExpiryDate(undefined);
    setNotificationPeriod(90);
    setVersionNotes('');
  };
  
  const toggleTag = (tag: DocumentTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const title = existingDocument ? 'Upload New Version' : 'Upload Document';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onClose();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentFile">File</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Change file
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to upload</p>
                  <Input
                    id="documentFile"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('documentFile')?.click()}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {existingDocument ? (
            <div className="grid gap-2">
              <Label htmlFor="versionNotes">Version Notes (Optional)</Label>
              <Textarea
                id="versionNotes"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Describe what's changed in this version"
                rows={2}
              />
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={documentType}
                  onValueChange={(value) => setDocumentType(value as FolderType)}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select type" />
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
              
              <div className="grid gap-2">
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lease Agreement 2023"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="documentDescription">Description (Optional)</Label>
                <Textarea
                  id="documentDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a brief description of this document"
                  rows={2}
                />
              </div>
              
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Document Expiry Date (Optional)</Label>
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
                <Label className="text-base font-medium">Lease Key Dates (Optional)</Label>
                
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
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !file || (!existingDocument && !name)}
          >
            {isUploading ? 'Uploading...' : existingDocument ? 'Upload New Version' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
