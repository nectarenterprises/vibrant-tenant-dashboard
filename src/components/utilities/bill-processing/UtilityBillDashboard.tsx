
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Zap, Droplets, Flame } from 'lucide-react';
import { Property, PropertyDocument } from '@/types/property';
import { useUtilityBills } from '@/hooks/utility/useUtilityBills';
import UtilityBillUploadDialog from './UtilityBillUploadDialog';
import UtilityAnomalies from './UtilityAnomalies';
import UtilityUsageCard from './charts/UtilityUsageCard';
import CostComparisonChart from './charts/CostComparisonChart';
import BillHistorySection from './history/BillHistorySection';

interface UtilityBillDashboardProps {
  property: Property;
  utilityDocuments: PropertyDocument[];
  documentsLoading: boolean;
  onUploadClick: () => void;
}

const UtilityBillDashboard: React.FC<UtilityBillDashboardProps> = ({
  property,
  utilityDocuments,
  documentsLoading,
  onUploadClick
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const {
    bills: utilityBills,
    isLoadingBills,
    isLoading,
    selectedUtilityType,
    setSelectedUtilityType,
    getUtilityUsageData,
    getUtilityCostData,
    detectAnomalies
  } = useUtilityBills(property.id);
  
  // Get data for charts
  const electricityData = getUtilityUsageData('electricity');
  const gasData = getUtilityUsageData('gas');
  const waterData = getUtilityUsageData('water');
  const costData = getUtilityCostData();
  const anomalies = detectAnomalies();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{property.name} - Utility Bills</h2>
          <p className="text-muted-foreground">
            Track, analyze and manage utility bills for this property
          </p>
        </div>
        
        <Button 
          className="bg-tenant-green hover:bg-tenant-darkGreen"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Utility Bill
        </Button>
      </div>
      
      {anomalies.length > 0 && (
        <UtilityAnomalies anomalies={anomalies} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UtilityUsageCard
          title="Electricity Usage"
          icon={Zap}
          iconColor="tenant-purple"
          data={electricityData}
          primaryColor="#8B5CF6"
          secondaryColor="#4C1D95"
          usageUnit="kWh"
          onUploadClick={() => setUploadDialogOpen(true)}
        />
        
        <UtilityUsageCard
          title="Gas Usage"
          icon={Flame}
          iconColor="tenant-orange"
          data={gasData}
          primaryColor="#F97316"
          secondaryColor="#C2410C"
          usageUnit="m³"
          onUploadClick={() => setUploadDialogOpen(true)}
        />
        
        <UtilityUsageCard
          title="Water Usage"
          icon={Droplets}
          iconColor="tenant-teal"
          data={waterData}
          primaryColor="#0EA5E9"
          secondaryColor="#0369A1"
          usageUnit="gallons"
          onUploadClick={() => setUploadDialogOpen(true)}
        />
      </div>
      
      <CostComparisonChart 
        data={costData}
        onUploadClick={() => setUploadDialogOpen(true)}
      />
      
      <BillHistorySection 
        utilityBills={utilityBills}
        isLoading={isLoading}
        selectedUtilityType={selectedUtilityType}
        setSelectedUtilityType={setSelectedUtilityType}
        onUploadClick={() => setUploadDialogOpen(true)}
      />
      
      <UtilityBillUploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        propertyId={property.id}
      />
    </div>
  );
};

export default UtilityBillDashboard;
