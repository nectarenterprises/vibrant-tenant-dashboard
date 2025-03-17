
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { FileUpload, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComparisonFileUploadProps {
  propertyId: string;
  onUploadComplete: () => void;
}

const ComparisonFileUpload: React.FC<ComparisonFileUploadProps> = ({ 
  propertyId, 
  onUploadComplete 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array and append to existing files
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one file to upload."
      });
      return;
    }

    if (!propertyId) {
      toast({
        variant: "destructive",
        title: "No property selected",
        description: "Please select a property before uploading files."
      });
      return;
    }

    setIsUploading(true);

    try {
      // Mock upload for now - in a real app, this would call an API to process the files
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) have been uploaded for processing.`
      });
      
      setFiles([]);
      setYear(new Date().getFullYear().toString());
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="file-year">File Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(yearOption => (
                <SelectItem key={yearOption} value={yearOption}>{yearOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="file-upload">Upload Files</Label>
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="flex-1"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <FileUpload className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-muted/50 p-3 rounded-md">
          <h3 className="font-semibold mb-2">Selected Files ({files.length})</h3>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm p-1 hover:bg-muted rounded">
                <span className="truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  &times;
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading || files.length === 0}>
          {isUploading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ComparisonFileUpload;
