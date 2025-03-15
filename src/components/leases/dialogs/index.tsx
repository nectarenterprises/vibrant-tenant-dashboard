
import React from 'react';
import { Property, Incentive, DocumentType } from '@/types/property';
import PropertyDialog from './PropertyDialog';
import TenantDialog from './TenantDialog';
import DocumentDialog from './DocumentDialog';
import PremisesScheduleDialog from './PremisesScheduleDialog';
import IncentivesDialog from './IncentivesDialog';

// Export all dialogs for easy importing elsewhere
export {
  PropertyDialog,
  TenantDialog,
  DocumentDialog,
  PremisesScheduleDialog,
  IncentivesDialog
};

// Dialog props types
export interface LeaseDialogsProps {
  propertyId: string;
  // Property dialog props
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
  
  // Tenant dialog props
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
  
  // Document dialog props
  showDocumentDialog: boolean;
  setShowDocumentDialog: (show: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  
  // Premises dialog props
  showPremisesDialog: boolean;
  setShowPremisesDialog: (show: boolean) => void;
  premisesSchedule: string;
  setPremisesSchedule: (schedule: string) => void;
  
  // Incentives dialog props
  showIncentivesDialog: boolean;
  setShowIncentivesDialog: (show: boolean) => void;
  incentives: Incentive[];
  setIncentives: (incentives: Incentive[]) => void;
  
  // Event handlers
  onDocumentUploaded?: () => void;
  onTenantSaved?: () => void;
}

// Main LeaseDialogs component that renders all dialog components
const LeaseDialogs: React.FC<LeaseDialogsProps> = (props) => {
  const {
    propertyId,
    // Property dialog props
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
    
    // Tenant dialog props
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
    
    // Document dialog props
    showDocumentDialog,
    setShowDocumentDialog,
    selectedFile,
    setSelectedFile,
    documentType,
    setDocumentType,
    documentName,
    setDocumentName,
    
    // Premises dialog props
    showPremisesDialog,
    setShowPremisesDialog,
    premisesSchedule,
    setPremisesSchedule,
    
    // Incentives dialog props
    showIncentivesDialog,
    setShowIncentivesDialog,
    incentives,
    setIncentives,
    
    // Event handlers
    onDocumentUploaded,
    onTenantSaved
  } = props;

  return (
    <>
      <PropertyDialog 
        showPropertyDialog={showPropertyDialog}
        setShowPropertyDialog={setShowPropertyDialog}
        propertyId={propertyId}
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
        showTenantDialog={showTenantDialog}
        setShowTenantDialog={setShowTenantDialog}
        propertyId={propertyId}
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
        isOpen={showDocumentDialog}
        onOpenChange={setShowDocumentDialog}
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
