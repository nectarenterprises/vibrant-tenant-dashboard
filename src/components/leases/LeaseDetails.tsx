
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';

// Import our new component sections
import LeaseOverview from './sections/LeaseOverview';
import TenantDetails from './sections/TenantDetails';
import DocumentsSection from './sections/DocumentsSection';
import PropertyDetailsSection from './sections/PropertyDetailsSection';
import PremisesScheduleSection from './sections/PremisesScheduleSection';
import IncentivesSection from './sections/IncentivesSection';

// Import our dialog components
import PropertyDialog from './dialogs/PropertyDialog';
import TenantDialog from './dialogs/TenantDialog';
import DocumentDialog from './dialogs/DocumentDialog';

interface LeaseDetailsProps {
  property: Property;
}

const LeaseDetails: React.FC<LeaseDetailsProps> = ({ property }) => {
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
  
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showTenantDialog, setShowTenantDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'lease' | 'utility' | 'compliance' | 'service-charge' | 'other'>('lease');
  const [documentName, setDocumentName] = useState('');
  
  const { 
    name, 
    address, 
    rentalFee, 
    nextPaymentDate, 
    leaseExpiry, 
    premisesSchedule, 
    incentives = [] 
  } = property;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="h-48 mellow-gradient relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white font-bold text-2xl">{name}</h2>
            <p className="text-white/90">{address}</p>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LeaseOverview 
              rentalFee={rentalFee} 
              nextPaymentDate={nextPaymentDate}
              leaseExpiry={leaseExpiry}
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
          
          {/* Dialogs */}
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
          />
          
          <div className="mt-6">
            <PremisesScheduleSection premisesSchedule={premisesSchedule} />
          </div>
          
          <div className="mt-6">
            <IncentivesSection incentives={incentives} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseDetails;
