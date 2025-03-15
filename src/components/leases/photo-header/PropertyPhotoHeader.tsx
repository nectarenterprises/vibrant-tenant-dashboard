
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getPropertyImageUrl } from '@/services/property/PropertyImageService';
import PhotoHeaderImage from './PhotoHeaderImage';
import PhotoHeaderContent from './PhotoHeaderContent';
import UploadDialog from './UploadDialog';
import { usePropertyPhoto } from './usePropertyPhoto';

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
  const {
    uploadDialogOpen,
    setUploadDialogOpen,
    selectedFile,
    setSelectedFile,
    isUploading,
    handleUpload
  } = usePropertyPhoto(propertyId, propertyName, onPhotoUpdated);

  return (
    <>
      <div className="h-48 relative">
        <PhotoHeaderImage backgroundImage={backgroundImage} />
        <PhotoHeaderContent 
          propertyName={propertyName}
          address={address}
          onUpdatePhoto={() => setUploadDialogOpen(true)}
        />
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        selectedFile={selectedFile}
        onFileChange={setSelectedFile}
        isUploading={isUploading}
        onUpload={handleUpload}
        propertyName={propertyName}
      />
    </>
  );
};

export default PropertyPhotoHeader;
