
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  onSelectProperty: (propertyId: string) => void;
}

const PropertySelector = ({ 
  properties, 
  selectedProperty, 
  isLoading, 
  onSelectProperty 
}: PropertySelectorProps) => {
  // Filter out duplicate properties based on their name and address instead of just ID
  const uniqueProperties = properties.reduce((acc: Property[], current) => {
    const x = acc.find(item => 
      item.name === current.name && 
      item.address === current.address
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>Select a property to view documents</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : uniqueProperties.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {uniqueProperties.map(property => (
              <Button
                key={property.id}
                variant={selectedProperty?.id === property.id ? "default" : "outline"}
                className="w-full justify-start overflow-hidden"
                onClick={() => onSelectProperty(property.id)}
              >
                <Folder className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{property.name}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertySelector;
