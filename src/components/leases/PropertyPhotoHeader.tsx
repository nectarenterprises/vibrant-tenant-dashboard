import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadPropertyDocument } from '@/services/document';
import { uploadPropertyImage, updatePropertyImage } from '@/services/property/PropertyImageService';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyPhotoHeaderProps {
  propertyId: string;
  propertyName: string;
  address: string;
  backgroundImage?: string;
  onPhotoUpdated: () => void;
}

const PropertyPhotoHeader: React.FC<PropertyPhotoHeaderProps> = ({
  propertyId,
  propertyName,
  address,
  backgroundImage,
  onPhotoUpdated
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to upload."
      });
      return;
    }

    setIsUploading(true);

    try {
      const imagePath = await uploadPropertyImage(selectedFile);
      
      if (!imagePath) {
        throw new Error("Failed to upload image");
      }

      const updated = await updatePropertyImage(propertyId, imagePath);
      
      if (!updated) {
        throw new Error("Failed to update property record");
      }

      await uploadPropertyDocument(
        propertyId,
        selectedFile,
        'photo' as DocumentType,
        `Property Photo - ${new Date().toLocaleDateString()}`,
        `Property photo for ${propertyName}`
      );
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your property photo has been updated."
      });
      
      setUploadDialogOpen(false);
      setSelectedFile(null);
      onPhotoUpdated();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your photo."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="h-48 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: backgroundImage 
              ? `url(${backgroundImage})` 
              : 'url(/placeholder.svg)',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
          <div>
            <h2 className="text-white font-bold text-2xl">{propertyName}</h2>
            <p className="text-white/90">{address}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:text-white"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Camera className="mr-2 h-4 w-4" />
            Update Photo
          </Button>
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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
                      onClick={() => setSelectedFile(null)}
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
              onClick={() => setUploadDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyPhotoHeader;
