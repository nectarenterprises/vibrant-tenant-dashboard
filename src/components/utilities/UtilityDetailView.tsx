
import React, { useEffect, useState } from 'react';
import { PropertyDocument } from '@/types/property';
import { LucideIcon, Upload } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { getPropertyDocuments } from '@/services/FileStorageService';
import { toast } from '@/components/ui/use-toast';
import { downloadDocument } from '@/services/document';
import BackButton from './detail/BackButton';
import DetailHeader from './detail/DetailHeader';
import StatsCards from './detail/StatsCards';
import UtilityDataTable from './detail/UtilityDataTable';
import DocumentsList from './detail/DocumentsList';

interface UtilityDetailViewProps {
  title: string;
  data: Array<{ month: string; usage: number; cost: number }>;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  onBack: () => void;
  propertyId: string;
  utilityType: 'electricity' | 'water' | 'gas';
  isLoading?: boolean;
  onUploadBill?: () => void;
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({
  title,
  data,
  Icon,
  iconColor,
  iconBgColor,
  primaryColor,
  secondaryColor,
  usageUnit,
  onBack,
  propertyId,
  utilityType,
  isLoading = false,
  onUploadBill
}) => {
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(true);

  // Calculate stats
  const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
  const totalCost = data.reduce((acc, item) => acc + item.cost, 0);
  const averageUsage = totalUsage / (data.length || 1);
  const averageCost = totalCost / (data.length || 1);

  useEffect(() => {
    const fetchUtilityDocuments = async () => {
      if (!propertyId) return;
      
      setIsDocumentsLoading(true);
      try {
        // Fetch documents of type 'utility'
        const documents = await getPropertyDocuments(propertyId, 'utility');
        // Filter documents based on utility type
        const filteredDocs = documents.filter(doc => {
          const searchText = `${doc.name?.toLowerCase() || ''} ${doc.description?.toLowerCase() || ''}`;
          return searchText.includes(utilityType.toLowerCase());
        });
        
        setUtilityDocuments(filteredDocs);
      } catch (error) {
        console.error('Error fetching utility documents:', error);
      } finally {
        setIsDocumentsLoading(false);
      }
    };

    fetchUtilityDocuments();
  }, [propertyId, utilityType]);

  const handleDownloadDocument = async (document: PropertyDocument) => {
    try {
      await downloadDocument(document.filePath, document.name);
      toast({
        title: "Document downloaded",
        description: `${document.name} has been downloaded successfully.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document."
      });
    }
  };

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      
      <DetailHeader 
        title={title} 
        Icon={Icon} 
        iconColor={iconColor} 
        iconBgColor={iconBgColor} 
      />

      <UtilityBaseChart
        data={data}
        title={title}
        Icon={Icon}
        iconColor={iconColor}
        iconBgColor={iconBgColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        usageUnit={usageUnit}
        isLoading={isLoading}
      />
      
      <StatsCards
        totalUsage={totalUsage}
        totalCost={totalCost}
        averageUsage={averageUsage}
        averageCost={averageCost}
        usageUnit={usageUnit}
        isLoading={isLoading}
      />

      <UtilityDataTable 
        data={data} 
        usageUnit={usageUnit}
        isLoading={isLoading} 
      />

      <DocumentsList
        title={title}
        documents={utilityDocuments}
        isLoading={isDocumentsLoading}
        onDownload={handleDownloadDocument}
        onUpload={onUploadBill}
      />
    </div>
  );
};

export default UtilityDetailView;
