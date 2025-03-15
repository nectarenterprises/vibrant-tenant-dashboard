
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadFieldProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  file,
  setFile,
  onFileChange
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentFile">File</Label>
      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
        {file ? (
          <div className="text-center">
            <p className="text-sm font-medium mb-1">{file.name}</p>
            <p className="text-xs text-muted-foreground mb-4">{(file.size / 1024).toFixed(1)} KB</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFile(null)}
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
              onChange={onFileChange}
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
  );
};

export default FileUploadField;
