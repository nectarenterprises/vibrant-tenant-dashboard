
import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderType, DOCUMENT_TYPES } from '@/services/document/types';

interface UploadDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fileUpload: File | null;
  documentName: string;
  documentDescription: string;
  documentType: FolderType;
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onTypeChange: (type: FolderType) => void;
  onUpload: () => void;
}

const UploadDialog = ({
  isOpen,
  setIsOpen,
  fileUpload,
  documentName,
  documentDescription,
  documentType,
  isUploading,
  onFileSelect,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onUpload
}: UploadDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the selected folder
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="document-file" className="text-sm font-medium">
              Select File
            </label>
            <div className="flex items-center gap-2">
              <Input 
                id="document-file" 
                type="file" 
                onChange={onFileSelect}
                className="flex-1"
              />
            </div>
            {fileUpload && (
              <p className="text-xs text-muted-foreground">
                Selected: {fileUpload.name} ({(fileUpload.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document-type">Document Type</Label>
            <Select
              value={documentType}
              onValueChange={(value) => onTypeChange(value as FolderType)}
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
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
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="document-name" className="text-sm font-medium">
              Document Name
            </label>
            <Input 
              id="document-name" 
              value={documentName} 
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter document name"
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="document-description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea 
              id="document-description" 
              value={documentDescription} 
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Enter document description"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onUpload}
            disabled={!fileUpload || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
