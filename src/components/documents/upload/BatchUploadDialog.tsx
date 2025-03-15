
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderType } from '@/services/document/types';
import { DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import DragAndDropUpload from './DragAndDropUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { uploadPropertyDocument } from '@/services/document';
import { Loader2 } from 'lucide-react';

interface BatchUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onComplete: () => void;
}

const BatchUploadDialog: React.FC<BatchUploadDialogProps> = ({
  isOpen,
  onClose,
  propertyId,
  onComplete
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<FolderType>('other');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!propertyId) {
      toast({
        title: "No property selected",
        description: "Please select a property to upload documents to",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    let successCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i) / files.length) * 100);
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        
        const result = await uploadPropertyDocument(
          propertyId,
          file,
          documentType as DocumentType,
          file.name,
          `Uploaded as part of batch upload on ${new Date().toLocaleDateString()}`
        );
        
        if (result) {
          successCount++;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));
        }
      }
      
      toast({
        title: "Batch upload complete",
        description: `Successfully uploaded ${successCount} of ${files.length} files.`
      });
      
      onComplete();
      handleClose();
    } catch (error) {
      console.error('Error during batch upload:', error);
      toast({
        title: "Upload error",
        description: "There was a problem uploading your files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setUploadProgress({});
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Batch Upload Documents</DialogTitle>
          <DialogDescription>
            Upload multiple documents at once to the selected property
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type (for all files)</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as FolderType)}
            >
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lease">Lease Documents</SelectItem>
                <SelectItem value="utility">Utility Bills</SelectItem>
                <SelectItem value="compliance">Compliance Documents</SelectItem>
                <SelectItem value="service-charge">Service Charge Documents</SelectItem>
                <SelectItem value="correspondence">Correspondence</SelectItem>
                <SelectItem value="photo">Property Photos</SelectItem>
                <SelectItem value="insurance">Insurance Documents</SelectItem>
                <SelectItem value="tax">Tax Documents</SelectItem>
                <SelectItem value="other">Other Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DragAndDropUpload 
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
          />
          
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected files: {files.length}</p>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {files.map((file, index) => (
                  <div key={index} className="text-sm py-1 border-b last:border-0 flex justify-between">
                    <span className="truncate max-w-[250px]">{file.name}</span>
                    {uploading && uploadProgress[file.name] !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {uploadProgress[file.name]}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading {files.length} files...
              </>
            ) : (
              `Upload ${files.length} files`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchUploadDialog;
