
import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  isUploading: boolean;
  onUpload: () => Promise<void>;
  propertyName: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  selectedFile,
  onFileChange,
  isUploading,
  onUpload,
  propertyName
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Property Photo</DialogTitle>
          <DialogDescription>
            Upload a new photo for {propertyName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="property-photo">Photo</Label>
            <div 
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center"
            >
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onFileChange(null)}
                  >
                    Change photo
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop or click to upload
                  </p>
                  <Input
                    id="property-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('property-photo')?.click()}
                  >
                    Select Photo
                  </Button>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: High-quality JPG or PNG image.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
