
import React from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

interface PropertyHeaderProps {
  property: Property;
  showComparison: boolean;
  onToggleComparison: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  showComparison,
  onToggleComparison
}) => {
  const { name, address } = property;
  
  return (
    <div className="h-48 relative">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-white font-bold text-2xl">{name}</h2>
            <p className="text-white/90">{address}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:text-white"
            onClick={onToggleComparison}
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {showComparison ? 'Hide Comparison' : 'Compare Years'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
