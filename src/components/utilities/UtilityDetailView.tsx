
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import { getPropertyDocuments } from '@/services/FileStorageService';
import UtilityChart from './UtilityChart';
import UtilityDocuments from './UtilityDocuments';
import UtilityBillDashboard from './bill-processing/UtilityBillDashboard';

interface UtilityDetailViewProps {
  property: Property;
  onBack: () => void;
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({ property, onBack }) => {
  const [activeTab, setActiveTab] = useState('usage');
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const docs = await getPropertyDocuments(property.id);
        const utilityDocs = docs.filter(doc => doc.documentType === 'utility');
        setDocuments(utilityDocs);
      } catch (error) {
        console.error('Error loading utility documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    loadDocuments();
  }, [property.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{property.name} - Utilities</h2>
        <button
          onClick={onBack}
          className="text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
        >
          ← Back to all properties
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="usage">Usage Analysis</TabsTrigger>
          <TabsTrigger value="bills">Bill Processing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Utility Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <UtilityChart property={property} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-6">
          <UtilityBillDashboard property={property} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <UtilityDocuments 
            property={property} 
            documents={documents} 
            isLoading={isLoadingDocuments} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityDetailView;
