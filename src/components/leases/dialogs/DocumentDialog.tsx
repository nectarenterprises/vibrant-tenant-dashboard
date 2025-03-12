
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface DocumentDialogProps {
  showDocumentDialog: boolean;
  setShowDocumentDialog: (show: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  showDocumentDialog,
  setShowDocumentDialog,
  selectedFile,
  setSelectedFile,
  documentType,
  setDocumentType,
  documentName,
  setDocumentName
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!documentName) {
        setDocumentName(e.target.files[0].name);
      }
    }
  };
  
  const handleDocumentUpload = () => {
    toast({
      title: "Document uploaded",
      description: `${documentName} has been uploaded successfully.`,
    });
    setShowDocumentDialog(false);
    setSelectedFile(null);
    setDocumentName('');
    setDocumentType('lease');
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
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDocumentUpload}
            disabled={!selectedFile || !documentName || !documentType}
          >
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
