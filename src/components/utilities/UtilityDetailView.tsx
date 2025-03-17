
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
import { Button } from '@/components/ui/button';

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

  // Calculate stats - use 0 if no data available
  const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
  const totalCost = data.reduce((acc, item) => acc + item.cost, 0);
  const averageUsage = data.length ? totalUsage / data.length : 0;
  const averageCost = data.length ? totalCost / data.length : 0;

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

      {data.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
          <div className={`${iconBgColor} p-3 rounded-full mx-auto mb-4 w-12 h-12 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold mb-2">No {title} Data Available</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Upload your utility bills to start tracking your usage and costs over time.
          </p>
          {onUploadBill && (
            <Button onClick={onUploadBill} className="mx-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} Bill
            </Button>
          )}
        </div>
      )}

      {data.length > 0 && (
        <>
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
        </>
      )}

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
