import React, { useState, useEffect } from 'react';
import { Property, DocumentType } from '@/types/property';
import LeaseDetails from './LeaseDetails';
import { fetchTenantDetails } from '@/services/tenant/TenantService';
import { fetchPropertyDetails } from '@/services/property/PropertyDetailsService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [documentType, setDocumentType] = useState<DocumentType>('lease');
  const [documentName, setDocumentName] = useState('');
  
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      
      try {
        const tenantData = await fetchTenantDetails(property.id);
        if (tenantData) {
          setTenantName(tenantData.tenant_name);
          setContactName(tenantData.contact_name || '');
          setContactEmail(tenantData.contact_email || '');
          setContactPhone(tenantData.contact_phone || '');
        } else {
          setTenantName('');
          setContactName('');
          setContactEmail('');
          setContactPhone('');
        }
        
        const propertyDetails = await fetchPropertyDetails(property.id);
        if (propertyDetails) {
          setPropertyType(propertyDetails.property_type || '');
          setFloorArea(propertyDetails.floor_area || '');
          setYearBuilt(propertyDetails.year_built || '');
          setParkingSpaces(propertyDetails.parking_spaces || '');
          setLeaseType(propertyDetails.lease_type || '');
          setLeaseStart(propertyDetails.lease_start ? new Date(propertyDetails.lease_start) : undefined);
          setLeaseDuration(propertyDetails.lease_duration || '');
          setSecurityDeposit(propertyDetails.security_deposit || '');
        } else {
          setPropertyType('');
          setFloorArea('');
          setYearBuilt('');
          setParkingSpaces('');
          setLeaseType('');
          setLeaseStart(undefined);
          setLeaseDuration('');
          setSecurityDeposit('');
        }
        
        setPremisesSchedule(property.premisesSchedule || '');
        setIncentives(property.incentives || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load property data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, [property.id, property.premisesSchedule, property.incentives]);
  
  const handleDocumentUploaded = () => {
    setRefreshDocuments(prev => prev + 1);
  };
  
  const handleTenantSaved = () => {
  };
  
  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
  };

  return (
    <LeaseDetails
      property={property}
      propertyId={property.id}
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
      setDocumentType={handleDocumentTypeChange}
      setDocumentName={setDocumentName}
      onDocumentUploaded={handleDocumentUploaded}
      onTenantSaved={handleTenantSaved}
      isLoading={isLoading}
    />
  );
};

export default LeaseDetailsContainer;
