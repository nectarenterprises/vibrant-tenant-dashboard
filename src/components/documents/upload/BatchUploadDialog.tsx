
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDropzone } from 'react-dropzone';
import { File } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Property } from '@/types/property';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

interface BatchUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  property: Property | null;
}

const BatchUploadDialog: React.FC<BatchUploadDialogProps> = ({ open, setOpen, property }) => {
  const [selected, setSelected] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('lease');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelected(acceptedFiles);
    setFilenames(acceptedFiles.map(file => file.name));
    setDescriptions(acceptedFiles.map(() => '')); // Initialize descriptions
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  });

  const handleFilenameChange = (index: number, value: string) => {
    const newFilenames = [...filenames];
    newFilenames[index] = value;
    setFilenames(newFilenames);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleUpload = async () => {
    if (!selected || !property) return;
    
    try {
      setUploading(true);
      
      // Process each selected file
      const uploadPromises = selected.map(async (file, index) => {
        const fileName = filenames[index] || file.name;
        
        // Use the updated uploadDocument function with correct parameters
        return uploadDocument(
          property.id,
          file,
          fileName,
          selectedDocumentType,
          descriptions[index]
        );
      });
      
      // Execute all uploads in parallel
      const results = await Promise.all(uploadPromises);
      
      // Check for any errors during upload
      const uploadErrors = results.filter(result => !result);
      if (uploadErrors.length > 0) {
        throw new Error(`Failed to upload ${uploadErrors.length} documents.`);
      }
      
      toast({
        title: "Success",
        description: "All documents uploaded successfully."
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An error occurred during upload."
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batch Upload Documents</DialogTitle>
          <DialogDescription>
            Upload multiple documents at once.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentType" className="text-right">
              Document Type
            </Label>
            <Select onValueChange={setSelectedDocumentType} defaultValue={selectedDocumentType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="service-charge">Service Charge</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="correspondence">Correspondence</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p className="text-center text-muted-foreground">Drop the files here ...</p> :
                <p className="text-center text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
          {selected.length > 0 && (
            <div className="space-y-4">
              {selected.map((file, index) => (
                <div key={index} className="space-y-2 p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="File Name"
                    value={filenames[index] || file.name}
                    onChange={(e) => handleFilenameChange(index, e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Description (optional)"
                    value={descriptions[index] || ''}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {uploading && (
            <Progress value={progress} className="h-2" />
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleUpload} disabled={uploading || selected.length === 0}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BatchUploadDialog;
