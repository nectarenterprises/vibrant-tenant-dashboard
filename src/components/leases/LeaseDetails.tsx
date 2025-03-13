
import React from 'react';
import { Property, Incentive, DocumentType } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import LeaseContent from './LeaseContent';
import LeaseDialogs, { LeaseDialogsProps } from './dialogs';

interface LeaseDetailsProps extends LeaseDialogsProps {
  property: Property;
  propertyId: string; // Adding the missing propertyId prop
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
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="h-48 mellow-gradient relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white font-bold text-2xl">{property.name}</h2>
            <p className="text-white/90">{property.address}</p>
          </div>
        </div>
        
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
            propertyId={propertyId} // Using the passed propertyId
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
