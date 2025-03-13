
import React from 'react';
import { Property, Incentive, DocumentType } from '@/types/property';
import PropertyDialog from './dialogs/PropertyDialog';
import TenantDialog from './dialogs/TenantDialog';
import DocumentDialog from './dialogs/DocumentDialog';
import PremisesScheduleDialog from './dialogs/PremisesScheduleDialog';
import IncentivesDialog from './dialogs/IncentivesDialog';

interface LeaseDialogsProps {
  propertyId: string;
  showPropertyDialog: boolean;
  setShowPropertyDialog: (show: boolean) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  floorArea: string;
  setFloorArea: (area: string) => void;
  yearBuilt: string;
  setYearBuilt: (year: string) => void;
  parkingSpaces: string;
  setParkingSpaces: (spaces: string) => void;
  leaseType: string;
  setLeaseType: (type: string) => void;
  leaseStart: Date | undefined;
  setLeaseStart: (date: Date | undefined) => void;
  leaseDuration: string;
  setLeaseDuration: (duration: string) => void;
  securityDeposit: string;
  setSecurityDeposit: (deposit: string) => void;
  showTenantDialog: boolean;
  setShowTenantDialog: (show: boolean) => void;
  tenantName: string;
  setTenantName: (name: string) => void;
  contactName: string;
  setContactName: (name: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  showDocumentDialog: boolean;
  setShowDocumentDialog: (show: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  onDocumentUploaded: () => void;
  showPremisesDialog: boolean;
  setShowPremisesDialog: (show: boolean) => void;
  premisesSchedule: string;
  setPremisesSchedule: (schedule: string) => void;
  showIncentivesDialog: boolean;
  setShowIncentivesDialog: (show: boolean) => void;
  incentives: Incentive[];
  setIncentives: (incentives: Incentive[]) => void;
  onTenantSaved?: () => void;
}

const LeaseDialogs: React.FC<LeaseDialogsProps> = ({
  propertyId,
  showPropertyDialog,
  setShowPropertyDialog,
  propertyType,
  setPropertyType,
  floorArea,
  setFloorArea,
  yearBuilt,
  setYearBuilt,
  parkingSpaces,
  setParkingSpaces,
  leaseType,
  setLeaseType,
  leaseStart,
  setLeaseStart,
  leaseDuration,
  setLeaseDuration,
  securityDeposit,
  setSecurityDeposit,
  showTenantDialog,
  setShowTenantDialog,
  tenantName,
  setTenantName,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  showDocumentDialog,
  setShowDocumentDialog,
  selectedFile,
  setSelectedFile,
  documentType,
  setDocumentType,
  documentName,
  setDocumentName,
  onDocumentUploaded,
  showPremisesDialog,
  setShowPremisesDialog,
  premisesSchedule,
  setPremisesSchedule,
  showIncentivesDialog,
  setShowIncentivesDialog,
  incentives,
  setIncentives,
  onTenantSaved
}) => {
  return (
    <>
      <PropertyDialog 
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
      />
      
      <TenantDialog 
        propertyId={propertyId}
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
        onTenantSaved={onTenantSaved}
      />
      
      <DocumentDialog 
        showDocumentDialog={showDocumentDialog}
        setShowDocumentDialog={setShowDocumentDialog}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        documentType={documentType}
        setDocumentType={setDocumentType}
        documentName={documentName}
        setDocumentName={setDocumentName}
        propertyId={propertyId}
        onDocumentUploaded={onDocumentUploaded}
      />
      
      <PremisesScheduleDialog
        showPremisesDialog={showPremisesDialog}
        setShowPremisesDialog={setShowPremisesDialog}
        premisesSchedule={premisesSchedule}
        setPremisesSchedule={setPremisesSchedule}
        propertyId={propertyId}
      />
      
      <IncentivesDialog 
        showIncentivesDialog={showIncentivesDialog}
        setShowIncentivesDialog={setShowIncentivesDialog}
        incentives={incentives}
        setIncentives={setIncentives}
        propertyId={propertyId}
      />
    </>
  );
};

export default LeaseDialogs;
