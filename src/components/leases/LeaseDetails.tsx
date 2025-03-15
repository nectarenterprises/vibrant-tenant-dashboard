
import React, { useState, useEffect } from 'react';
import { Property, Incentive, DocumentType } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import LeaseContent from './LeaseContent';
import LeaseDialogs, { LeaseDialogsProps } from './dialogs';
import PropertyPhotoHeader from './photo-header/PropertyPhotoHeader';
import { supabase } from '@/integrations/supabase/client';
import { getPropertyImageUrl } from '@/services/property/PropertyImageService';

interface LeaseDetailsProps extends LeaseDialogsProps {
  property: Property;
  propertyId: string;
  isLoading?: boolean;
  refreshDocuments: number;
}

const LeaseDetails: React.FC<LeaseDetailsProps> = ({ 
  property,
  propertyId,
  propertyType,
  floorArea,
  yearBuilt,
  parkingSpaces,
  leaseType,
  leaseStart,
  leaseDuration,
  securityDeposit,
  tenantName,
  contactName,
  contactEmail,
  contactPhone,
  premisesSchedule,
  incentives,
  showPropertyDialog,
  showTenantDialog,
  showDocumentDialog,
  showPremisesDialog,
  showIncentivesDialog,
  selectedFile,
  documentType,
  documentName,
  refreshDocuments,
  setPropertyType,
  setFloorArea,
  setYearBuilt,
  setParkingSpaces,
  setLeaseType,
  setLeaseStart,
  setLeaseDuration,
  setSecurityDeposit,
  setTenantName,
  setContactName,
  setContactEmail,
  setContactPhone,
  setPremisesSchedule,
  setIncentives,
  setShowPropertyDialog,
  setShowTenantDialog,
  setShowDocumentDialog,
  setShowPremisesDialog,
  setShowIncentivesDialog,
  setSelectedFile,
  setDocumentType,
  setDocumentName,
  onDocumentUploaded,
  onTenantSaved,
  isLoading
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Fetch the property image if it exists
    const fetchPropertyImage = async () => {
      try {
        const { data: propertyData, error } = await supabase
          .from('properties')
          .select('image_path')
          .eq('id', propertyId)
          .single();
        
        if (error) throw error;
        
        if (propertyData?.image_path) {
          const imageUrl = getPropertyImageUrl(propertyData.image_path);
          setBackgroundImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching property image:', error);
      }
    };

    fetchPropertyImage();
  }, [propertyId, refreshTrigger]);

  const handlePhotoUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <PropertyPhotoHeader
          propertyId={propertyId}
          propertyName={property.name}
          address={property.address}
          backgroundImage={backgroundImage}
          onPhotoUpdated={handlePhotoUpdated}
        />
        
        <CardContent className="pt-6">
          <LeaseContent 
            property={property}
            tenantName={tenantName}
            contactName={contactName}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            premisesSchedule={premisesSchedule}
            incentives={incentives}
            propertyType={propertyType}
            floorArea={floorArea}
            yearBuilt={yearBuilt}
            parkingSpaces={parkingSpaces}
            leaseType={leaseType}
            leaseStart={leaseStart}
            leaseDuration={leaseDuration}
            securityDeposit={securityDeposit}
            refreshDocuments={refreshDocuments}
            setShowTenantDialog={setShowTenantDialog}
            setShowDocumentDialog={setShowDocumentDialog}
            setShowPropertyDialog={setShowPropertyDialog}
            setShowPremisesDialog={setShowPremisesDialog}
            setShowIncentivesDialog={setShowIncentivesDialog}
            isLoading={isLoading}
          />
          
          <LeaseDialogs 
            propertyId={propertyId}
            showPropertyDialog={showPropertyDialog}
            setShowPropertyDialog={setShowPropertyDialog}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            floorArea={floorArea}
            setFloorArea={setFloorArea}
            yearBuilt={yearBuilt}
            setYearBuilt={setYearBuilt}
            parkingSpaces={parkingSpaces}
            setParkingSpaces={setParkingSpaces}
            leaseType={leaseType}
            setLeaseType={setLeaseType}
            leaseStart={leaseStart}
            setLeaseStart={setLeaseStart}
            leaseDuration={leaseDuration}
            setLeaseDuration={setLeaseDuration}
            securityDeposit={securityDeposit}
            setSecurityDeposit={setSecurityDeposit}
            showTenantDialog={showTenantDialog}
            setShowTenantDialog={setShowTenantDialog}
            tenantName={tenantName}
            setTenantName={setTenantName}
            contactName={contactName}
            setContactName={setContactName}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            showDocumentDialog={showDocumentDialog}
            setShowDocumentDialog={setShowDocumentDialog}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            documentType={documentType}
            setDocumentType={setDocumentType}
            documentName={documentName}
            setDocumentName={setDocumentName}
            onDocumentUploaded={onDocumentUploaded}
            showPremisesDialog={showPremisesDialog}
            setShowPremisesDialog={setShowPremisesDialog}
            premisesSchedule={premisesSchedule}
            setPremisesSchedule={setPremisesSchedule}
            showIncentivesDialog={showIncentivesDialog}
            setShowIncentivesDialog={setShowIncentivesDialog}
            incentives={incentives}
            setIncentives={setIncentives}
            onTenantSaved={onTenantSaved}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseDetails;
