
import React from 'react';
import { Property, PropertyDocument } from '@/types/property';
import UtilityDashboard from './UtilityDashboard';
import UtilityDocuments from './UtilityDocuments';
import { FolderType } from '@/services/document/types';

interface PropertyUtilityDetailsProps {
  property: Property;
  utilityDocuments: PropertyDocument[];
  documentsLoading: boolean;
  documentType: FolderType;
  onBack: () => void;
  onUploadClick: () => void;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
}

const PropertyUtilityDetails: React.FC<PropertyUtilityDetailsProps> = ({
  property,
  utilityDocuments,
  documentsLoading,
  documentType,
  onBack,
  onUploadClick,
  onDownload,
  onDelete
}) => {
  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
      >
        ← Back to all properties
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <UtilityDashboard property={property} />
        </div>
        
        <div>
          <UtilityDocuments 
            utilityDocuments={utilityDocuments}
            documentsLoading={documentsLoading}
            documentType={documentType}
            onUploadClick={onUploadClick}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyUtilityDetails;
