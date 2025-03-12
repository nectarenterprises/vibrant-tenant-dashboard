
import React from 'react';
import { Property, Incentive } from '@/types/property';
import LeaseOverview from './sections/LeaseOverview';
import TenantDetails from './sections/TenantDetails';
import DocumentsSection from './sections/DocumentsSection';
import PropertyDetailsSection from './sections/PropertyDetailsSection';
import PremisesScheduleSection from './sections/PremisesScheduleSection';
import IncentivesSection from './sections/IncentivesSection';

interface LeaseContentProps {
  property: Property;
  tenantName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  premisesSchedule: string;
  incentives: Incentive[];
  propertyType: string;
  floorArea: string;
  yearBuilt: string;
  parkingSpaces: string;
  leaseType: string;
  leaseStart: Date | undefined;
  leaseDuration: string;
  securityDeposit: string;
  refreshDocuments: number;
  setShowTenantDialog: (show: boolean) => void;
  setShowDocumentDialog: (show: boolean) => void;
  setShowPropertyDialog: (show: boolean) => void;
  setShowPremisesDialog: (show: boolean) => void;
  setShowIncentivesDialog: (show: boolean) => void;
}

const LeaseContent: React.FC<LeaseContentProps> = ({
  property,
  tenantName,
  contactName,
  contactEmail,
  contactPhone,
  premisesSchedule,
  incentives,
  propertyType,
  floorArea,
  yearBuilt,
  parkingSpaces,
  leaseType,
  leaseStart,
  leaseDuration,
  securityDeposit,
  refreshDocuments,
  setShowTenantDialog,
  setShowDocumentDialog,
  setShowPropertyDialog,
  setShowPremisesDialog,
  setShowIncentivesDialog
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeaseOverview 
          rentalFee={property.rentalFee} 
          nextPaymentDate={property.nextPaymentDate}
          leaseExpiry={property.leaseExpiry}
        />
        
        <TenantDetails 
          tenantName={tenantName}
          contactName={contactName}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
          setShowTenantDialog={setShowTenantDialog}
        />
        
        <DocumentsSection 
          setShowDocumentDialog={setShowDocumentDialog}
          propertyId={property.id}
          key={`docs-${refreshDocuments}`}
        />
      </div>
      
      <div className="mt-6">
        <PropertyDetailsSection 
          propertyType={propertyType}
          floorArea={floorArea}
          yearBuilt={yearBuilt}
          parkingSpaces={parkingSpaces}
          leaseType={leaseType}
          leaseStart={leaseStart}
          leaseDuration={leaseDuration}
          securityDeposit={securityDeposit}
          setShowPropertyDialog={setShowPropertyDialog}
        />
      </div>
      
      <div className="mt-6">
        <PremisesScheduleSection 
          premisesSchedule={premisesSchedule} 
          setShowPremisesDialog={setShowPremisesDialog}
        />
      </div>
      
      <div className="mt-6">
        <IncentivesSection 
          incentives={incentives} 
          setShowIncentivesDialog={setShowIncentivesDialog}
        />
      </div>
    </>
  );
};

export default LeaseContent;
