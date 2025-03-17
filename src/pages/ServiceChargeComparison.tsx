
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProperties } from '@/services/property/PropertyFetchService';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ServiceChargeComparisonDashboard from '@/components/service-charge/ServiceChargeComparisonDashboard';
import ComparisonFileUpload from '@/components/service-charge/comparison/ComparisonFileUpload';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ServiceChargeComparisonPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        const userProperties = await fetchUserProperties();
        setProperties(userProperties);
        
        // Set selected property based on URL param or first property
        if (propertyId) {
          const property = userProperties.find(p => p.id === propertyId);
          if (property) {
            setSelectedProperty(property);
          } else if (userProperties.length > 0) {
            setSelectedProperty(userProperties[0]);
          }
        } else if (userProperties.length > 0) {
          setSelectedProperty(userProperties[0]);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, [propertyId]);

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
              <p className="text-muted-foreground mb-4">
                Please add a property before using the service charge comparison tool.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Service Charge Comparison</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={selectedProperty?.id} 
            onValueChange={handlePropertyChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => setShowUpload(!showUpload)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Service Charge Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonFileUpload 
              propertyId={selectedProperty?.id || ''} 
              onUploadComplete={() => setShowUpload(false)}
            />
          </CardContent>
        </Card>
      )}

      {selectedProperty && (
        <ServiceChargeComparisonDashboard property={selectedProperty} />
      )}
    </div>
  );
};

export default ServiceChargeComparisonPage;
