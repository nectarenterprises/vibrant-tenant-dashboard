
import React, { useState, useCallback } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DragAndDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptMultiple?: boolean;
  acceptedFileTypes?: string;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({
  onFilesSelected,
  acceptMultiple = true,
  acceptedFileTypes = "*"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const filesToUpload = acceptMultiple ? filesArray : [filesArray[0]];
      onFilesSelected(filesToUpload);
    }
  }, [onFilesSelected, acceptMultiple]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const filesToUpload = acceptMultiple ? filesArray : [filesArray[0]];
      onFilesSelected(filesToUpload);
    }
  }, [onFilesSelected, acceptMultiple]);
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <FileUp className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-medium mb-1">Drag and drop your files here</p>
          <p className="text-sm text-muted-foreground">
            or click the button below to select files
          </p>
        </div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple={acceptMultiple}
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
        />
        <Button 
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Select Files
        </Button>
      </div>
    </div>
  );
};

export default DragAndDropUpload;
