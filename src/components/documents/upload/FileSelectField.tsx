
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderType } from '@/services/document/types';

interface FileSelectFieldProps {
  fileUpload: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileSelectField: React.FC<FileSelectFieldProps> = ({
  fileUpload,
  onFileSelect
}) => {
  return (
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
  );
};

export default FileSelectField;
