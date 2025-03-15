
import React from 'react';

interface PhotoHeaderImageProps {
  backgroundImage?: string;
}

const PhotoHeaderImage: React.FC<PhotoHeaderImageProps> = ({ backgroundImage }) => {
  return (
    <>
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
    </>
  );
};

export default PhotoHeaderImage;
