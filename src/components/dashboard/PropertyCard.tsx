
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Property } from '@/types/property';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, HomeIcon } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate">{property.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <HomeIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{property.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formatCurrency(property.rentalFee)}</span>
            <span className="ml-1">per month</span>
          </div>
          
          {property.leaseExpiry && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Lease expires: {new Date(property.leaseExpiry).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
