
import React from 'react';

interface UtilitiesHeaderProps {
  title?: string;
  description?: string;
}

const UtilitiesHeader: React.FC<UtilitiesHeaderProps> = ({ 
  title = "Utilities Dashboard", 
  description = "Monitor your property's utility usage and costs" 
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default UtilitiesHeader;
