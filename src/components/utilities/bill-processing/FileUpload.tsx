
import React, { useCallback } from 'react';
import { FileUp, File, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  allowedFileTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png']
}) => {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  }, [onFileChange]);

  const handleRemoveFile = useCallback(() => {
    onFileChange(null);
  }, [onFileChange]);

  return (
    <div className="space-y-2">
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-tenant-green transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileInputChange}
            accept={allowedFileTypes.join(',')}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <FileUp className="h-10 w-10 text-tenant-green mb-2" />
            <p className="text-base font-medium mb-1">Upload your utility bill</p>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: PDF, JPG, PNG
            </p>
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-8 w-8 text-tenant-green mr-3" />
            <div>
              <p className="font-medium truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-gray-500 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
