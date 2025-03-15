
import React, { useRef } from 'react';
import { FilePlus, Upload, CheckCircle, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };
  
  const handleDelete = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Upload Utility Bill</Label>
      
      {!file ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 transition-colors hover:border-tenant-green hover:bg-tenant-green/5 cursor-pointer flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          
          <FilePlus className="h-10 w-10 text-tenant-green mb-2" />
          
          <p className="text-sm text-center font-medium mb-1">Drag & drop your utility bill here</p>
          <p className="text-xs text-center text-muted-foreground mb-3">
            Supports PDF, JPG, PNG formats
          </p>
          
          <Button variant="outline" size="sm" type="button">
            <Upload className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-tenant-green mr-2" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
