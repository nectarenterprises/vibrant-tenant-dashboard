
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import LeaseDetails from './LeaseDetails';
import { fetchTenantDetails } from '@/services/tenant/TenantService';
import { toast } from '@/components/ui/use-toast';

interface LeaseDetailsContainerProps {
  property: Property;
}

const LeaseDetailsContainer: React.FC<LeaseDetailsContainerProps> = ({ property }) => {
  const [propertyType, setPropertyType] = useState<string>('');
  const [floorArea, setFloorArea] = useState<string>('');
  const [yearBuilt, setYearBuilt] = useState<string>('');
  const [parkingSpaces, setParkingSpaces] = useState<string>('');
  
  const [leaseType, setLeaseType] = useState<string>('');
  const [leaseStart, setLeaseStart] = useState<Date | undefined>(undefined);
  const [leaseDuration, setLeaseDuration] = useState<string>('');
  const [securityDeposit, setSecurityDeposit] = useState<string>('');
  
  const [tenantName, setTenantName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  
  const [premisesSchedule, setPremisesSchedule] = useState<string>(property.premisesSchedule || '');
  const [incentives, setIncentives] = useState(property.incentives || []);
  
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showTenantDialog, setShowTenantDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showPremisesDialog, setShowPremisesDialog] = useState(false);
  const [showIncentivesDialog, setShowIncentivesDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'lease' | 'utility' | 'compliance' | 'service-charge' | 'other'>('lease');
  const [documentName, setDocumentName] = useState('');
  
  // State for refreshing documents
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load tenant details on property change
  useEffect(() => {
    const loadTenantDetails = async () => {
      setIsLoading(true);
      try {
        const tenantData = await fetchTenantDetails(property.id);
        if (tenantData) {
          setTenantName(tenantData.tenant_name);
          setContactName(tenantData.contact_name || '');
          setContactEmail(tenantData.contact_email || '');
          setContactPhone(tenantData.contact_phone || '');
        } else {
          // Reset fields if no tenant data found
          setTenantName('');
          setContactName('');
          setContactEmail('');
          setContactPhone('');
        }
      } catch (error) {
        console.error('Error fetching tenant details:', error);
        toast({
          title: "Error",
          description: "Failed to load tenant details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTenantDetails();
  }, [property.id]);
  
  // Handle document upload success
  const handleDocumentUploaded = () => {
    setRefreshDocuments(prev => prev + 1);
  };
  
  // Handle tenant saved successfully
  const handleTenantSaved = () => {
    // Could potentially refresh the tenant data, but not needed since we set it directly
  };

  return (
    <LeaseDetails
      property={property}
      propertyType={propertyType}
      floorArea={floorArea}
      yearBuilt={yearBuilt}
      parkingSpaces={parkingSpaces}
      leaseType={leaseType}
      leaseStart={leaseStart}
      leaseDuration={leaseDuration}
      securityDeposit={securityDeposit}
      tenantName={tenantName}
      contactName={contactName}
      contactEmail={contactEmail}
      contactPhone={contactPhone}
      premisesSchedule={premisesSchedule}
      incentives={incentives}
      showPropertyDialog={showPropertyDialog}
      showTenantDialog={showTenantDialog}
      showDocumentDialog={showDocumentDialog}
      showPremisesDialog={showPremisesDialog}
      showIncentivesDialog={showIncentivesDialog}
      selectedFile={selectedFile}
      documentType={documentType}
      documentName={documentName}
      refreshDocuments={refreshDocuments}
      setPropertyType={setPropertyType}
      setFloorArea={setFloorArea}
      setYearBuilt={setYearBuilt}
      setParkingSpaces={setParkingSpaces}
      setLeaseType={setLeaseType}
      setLeaseStart={setLeaseStart}
      setLeaseDuration={setLeaseDuration}
      setSecurityDeposit={setSecurityDeposit}
      setTenantName={setTenantName}
      setContactName={setContactName}
      setContactEmail={setContactEmail}
      setContactPhone={setContactPhone}
      setPremisesSchedule={setPremisesSchedule}
      setIncentives={setIncentives}
      setShowPropertyDialog={setShowPropertyDialog}
      setShowTenantDialog={setShowTenantDialog}
      setShowDocumentDialog={setShowDocumentDialog}
      setShowPremisesDialog={setShowPremisesDialog}
      setShowIncentivesDialog={setShowIncentivesDialog}
      setSelectedFile={setSelectedFile}
      setDocumentType={setDocumentType}
      setDocumentName={setDocumentName}
      onDocumentUploaded={handleDocumentUploaded}
      onTenantSaved={handleTenantSaved}
      isLoading={isLoading}
    />
  );
};

export default LeaseDetailsContainer;
