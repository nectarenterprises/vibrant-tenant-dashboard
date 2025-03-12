
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadFieldProps {
  propertyImage: File | null;
  setPropertyImage: (file: File | null) => void;
}

const ImageUploadField = ({ propertyImage, setPropertyImage }: ImageUploadFieldProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "The maximum file size is 10MB.",
        });
        return;
      }
      setPropertyImage(file);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Label htmlFor="propertyImage">Property Image (Optional)</Label>
      <div className="flex items-center gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => document.getElementById('propertyImage')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
        <span className="text-sm text-muted-foreground">
          {propertyImage ? propertyImage.name : "No file chosen"}
        </span>
        <input
          id="propertyImage"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Accepted formats: JPEG, PNG. Max size: 10MB.
      </p>
    </div>
  );
};

export default ImageUploadField;
