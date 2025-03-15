import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FilePlus } from 'lucide-react';
import { Property } from '@/types/property';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';
import { FolderType, DOCUMENT_TYPES } from '@/services/document/types';

interface DocumentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  property: Property | null;
  onDocumentUploaded?: () => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({ isOpen, setIsOpen, property, onDocumentUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<FolderType>('lease');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setDocumentName('');
      setDocumentDescription('');
      setDocumentType('lease');
      setUploading(false);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
    if (file) {
      setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Set default name to filename
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !property) return;
    
    try {
      setUploading(true);
      
      // Use the updated uploadDocument function with correct parameters
      await uploadDocument(
        property.id,
        selectedFile,
        documentName,
        documentType,
        documentDescription
      );
      
      toast({
        title: "Document uploaded",
        description: `${documentName} has been uploaded successfully.`,
      });
      
      setIsOpen(false);
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error?.message || "There was an error uploading the document.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Upload a new document for this property.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g. Lease Agreement 2023"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="documentDescription">Description</Label>
            <Textarea
              id="documentDescription"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Brief description of the document"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select onValueChange={(value) => setDocumentType(value as FolderType)}>
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key as FolderType}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              type="file"
              id="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button variant="outline" asChild>
              <label htmlFor="file" className="cursor-pointer">
                {selectedFile ? selectedFile.name : <><FilePlus className="mr-2 h-4 w-4" /> Select File</>}
              </label>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading || !selectedFile || !documentName} onClick={handleUpload}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
