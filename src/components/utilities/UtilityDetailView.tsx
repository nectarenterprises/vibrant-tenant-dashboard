
import React, { useEffect, useState } from 'react';
import { PropertyDocument } from '@/types/property';
import { LucideIcon } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { getPropertyDocuments } from '@/services/FileStorageService';
import { toast } from '@/components/ui/use-toast';
import { downloadDocument } from '@/services/document';
import BackButton from './detail/BackButton';
import DetailHeader from './detail/DetailHeader';
import StatsCards from './detail/StatsCards';
import UtilityDataTable from './detail/UtilityDataTable';
import DocumentsList from './detail/DocumentsList';
import { useUtilityBills } from '@/hooks/utility/useUtilityBills';
import { UtilityType } from '@/types/utility';

interface UtilityDetailViewProps {
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  onBack: () => void;
  propertyId: string;
  utilityType: UtilityType;
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({
  title,
  Icon,
  iconColor,
  iconBgColor,
  primaryColor,
  secondaryColor,
  usageUnit,
  onBack,
  propertyId,
  utilityType,
}) => {
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(true);
  
  const { 
    bills, 
    isLoadingBills, 
    getUtilityUsageData 
  } = useUtilityBills(propertyId);
  
  // Get real usage data for this utility type
  const utilityData = getUtilityUsageData(utilityType);
  
  // Format data for chart
  const chartData = utilityData.map(item => ({
    month: item.period,
    usage: item.usage,
    cost: item.cost
  }));
  
  // Calculate stats from real data
  const totalUsage = utilityData.reduce((acc, item) => acc + item.usage, 0);
  const totalCost = utilityData.reduce((acc, item) => acc + item.cost, 0);
  const averageUsage = utilityData.length ? totalUsage / utilityData.length : 0;
  const averageCost = utilityData.length ? totalCost / utilityData.length : 0;

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

  const renderEmptyState = () => (
    <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
      <div className={`${iconBgColor} p-3 rounded-full mx-auto mb-4 w-12 h-12 flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">No {title} Data Available</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Upload your utility bills in the Documents section to track your usage and costs over time.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      
      <DetailHeader 
        title={title} 
        Icon={Icon} 
        iconColor={iconColor} 
        iconBgColor={iconBgColor} 
      />

      {chartData.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <UtilityBaseChart
            data={chartData}
            title={title}
            Icon={Icon}
            iconColor={iconColor}
            iconBgColor={iconBgColor}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            usageUnit={usageUnit}
            isLoading={isLoadingBills}
          />
          
          <StatsCards
            totalUsage={totalUsage}
            totalCost={totalCost}
            averageUsage={averageUsage}
            averageCost={averageCost}
            usageUnit={usageUnit}
            isLoading={isLoadingBills}
          />

          <UtilityDataTable 
            data={chartData} 
            usageUnit={usageUnit}
            isLoading={isLoadingBills} 
          />
        </>
      )}

      <DocumentsList
        title={title}
        documents={utilityDocuments}
        isLoading={isDocumentsLoading}
        onDownload={handleDownloadDocument}
      />
    </div>
  );
};

export default UtilityDetailView;
