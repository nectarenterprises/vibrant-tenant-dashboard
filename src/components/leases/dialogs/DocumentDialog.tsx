
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyDocument } from '@/services/FileStorageService';

interface DocumentDialogProps {
  showDocumentDialog: boolean;
  setShowDocumentDialog: (show: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  propertyId: string;
  onDocumentUploaded?: () => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  showDocumentDialog,
  setShowDocumentDialog,
  selectedFile,
  setSelectedFile,
  documentType,
  setDocumentType,
  documentName,
  setDocumentName,
  propertyId,
  onDocumentUploaded
}) => {
  const [documentDescription, setDocumentDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!documentName) {
        setDocumentName(e.target.files[0].name);
      }
    }
  };
  
  const handleDocumentUpload = async () => {
    if (!selectedFile || !documentName || !documentType || !propertyId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadPropertyDocument(
        propertyId,
        selectedFile,
        documentType,
        documentName,
        documentDescription
      );

      if (result) {
        toast({
          title: "Document uploaded",
          description: `${documentName} has been uploaded successfully.`,
        });
        
        // Reset form
        setShowDocumentDialog(false);
        setSelectedFile(null);
        setDocumentName('');
        setDocumentType('lease');
        setDocumentDescription('');
        
        // Trigger callback to refresh documents list
        if (onDocumentUploaded) {
          onDocumentUploaded();
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your document.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document related to this property lease.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as DocumentType)}
            >
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lease">Lease Agreement</SelectItem>
                <SelectItem value="utility">Utility Bill</SelectItem>
                <SelectItem value="compliance">Compliance Document</SelectItem>
                <SelectItem value="service-charge">Service Charge Statement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
            <Label htmlFor="documentDescription">Description (Optional)</Label>
            <Textarea
              id="documentDescription"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Add a brief description of this document"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="documentFile">File</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mb-4">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFile(null)}
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
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowDocumentDialog(false);
              setSelectedFile(null);
              setDocumentName('');
              setDocumentDescription('');
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDocumentUpload}
            disabled={isUploading || !selectedFile || !documentName || !documentType}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
