import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { fetchProperty } from '@/services/property';
import { useAuth } from '@/contexts/AuthContext';
import { uploadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { usePropertyPhoto } from './photo-header/usePropertyPhoto';

const PropertyPhotoHeader: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { user } = useAuth();
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { 
    photoUrl, 
    isLoading, 
    isUploading,
    setIsUploading,
    uploadPhoto 
  } = usePropertyPhoto(propertyId || '');
  
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => fetchProperty(propertyId || ''),
    enabled: !!propertyId
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
    }
  };

  // Update the uploadDocument call to match the correct signature
  const handleUpload = async () => {
    if (!fileUpload || !property) return;
    
    try {
      setUploading(true);
      
      // Use the updated uploadDocument function with correct parameters
      await uploadDocument(
        property.id,
        fileUpload,
        "Property Photo",
        "photo",
        "Main property photo"
      );
      
      toast({
        title: "Photo uploaded",
        description: "The property photo has been uploaded successfully."
      });
      
      // Refresh the property data to show the new photo
      // queryClient.invalidateQueries(['property', propertyId]);
      window.location.reload(); // temp fix
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the property photo."
      });
    } finally {
      setUploading(false);
      setFileUpload(null);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-secondary rounded-md">
      <div className="flex items-center space-x-4">
        {isLoading || propertyLoading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : (
          <Avatar className="h-12 w-12">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={property?.name} />
            ) : (
              <AvatarFallback>{property?.name?.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        )}
        
        <div>
          <h2 className="text-lg font-semibold">{property?.name || 'Loading...'}</h2>
          <p className="text-sm text-muted-foreground">{property?.address}</p>
        </div>
      </div>
      
      <div>
        <input
          type="file"
          id="propertyPhoto"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('propertyPhoto')?.click()}
        >
          {uploading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PropertyPhotoHeader;
