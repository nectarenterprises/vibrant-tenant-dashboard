
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoHeaderContentProps {
  propertyName: string;
  address: string;
  onUpdatePhoto: () => void;
}

const PhotoHeaderContent: React.FC<PhotoHeaderContentProps> = ({
  propertyName,
  address,
  onUpdatePhoto
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
      <div>
        <h2 className="text-white font-bold text-2xl">{propertyName}</h2>
        <p className="text-white/90">{address}</p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:text-white"
        onClick={onUpdatePhoto}
      >
        <Camera className="mr-2 h-4 w-4" />
        Update Photo
      </Button>
    </div>
  );
};

export default PhotoHeaderContent;
