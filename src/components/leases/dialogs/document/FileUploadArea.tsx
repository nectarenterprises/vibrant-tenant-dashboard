
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setDocumentName: (name: string) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  selectedFile,
  setSelectedFile,
  setDocumentName
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!selectedFile) {
        setDocumentName(e.target.files[0].name);
      }
    }
  };

  return (
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
  );
};

export default FileUploadArea;
