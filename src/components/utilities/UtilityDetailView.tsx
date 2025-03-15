
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

  // Utility chart data (mock data that would come from property)
  const utilityData = [
    { month: 'Jan', electricityUsage: 320, electricityCost: 80, gasUsage: 250, gasCost: 125, waterUsage: 42, waterCost: 36 },
    { month: 'Feb', electricityUsage: 300, electricityCost: 75, gasUsage: 280, gasCost: 140, waterUsage: 38, waterCost: 33 },
    { month: 'Mar', electricityUsage: 340, electricityCost: 85, gasUsage: 220, gasCost: 110, waterUsage: 45, waterCost: 38 },
    { month: 'Apr', electricityUsage: 280, electricityCost: 70, gasUsage: 180, gasCost: 90, waterUsage: 40, waterCost: 34 },
    { month: 'May', electricityUsage: 290, electricityCost: 72.5, gasUsage: 160, gasCost: 80, waterUsage: 43, waterCost: 37 },
    { month: 'Jun', electricityUsage: 350, electricityCost: 87.5, gasUsage: 140, gasCost: 70, waterUsage: 48, waterCost: 41 }
  ];

  const handleDownloadDocument = (document) => {
    console.log('Download document:', document);
  };

  const handleDeleteDocument = (document) => {
    console.log('Delete document:', document);
  };

  const handleUploadClick = () => {
    console.log('Upload clicked');
  };

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
              <UtilityChart data={utilityData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-6">
          <UtilityBillDashboard 
            property={property}
            utilityDocuments={documents}
            documentsLoading={isLoadingDocuments}
            onUploadClick={handleUploadClick}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <UtilityDocuments 
            utilityDocuments={documents}
            documentsLoading={isLoadingDocuments}
            documentType="utility"
            onUploadClick={handleUploadClick}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityDetailView;
