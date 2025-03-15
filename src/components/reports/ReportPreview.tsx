
import React from 'react';
import { Property } from '@/types/property';
import { ReportType } from '@/types/report';
import PropertySummaryReport from './templates/PropertySummaryReport';
import ServiceChargeReport from './templates/ServiceChargeReport';
import DocumentInventoryReport from './templates/DocumentInventoryReport';
import KeyDatesReport from './templates/KeyDatesReport';
import PortfolioReport from './templates/PortfolioReport';

interface ReportPreviewProps {
  reportType: ReportType;
  property: Property;
  properties: Property[];
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportType, property, properties }) => {
  const renderReport = () => {
    switch (reportType) {
      case 'property-summary':
        return <PropertySummaryReport property={property} />;
      case 'service-charge':
        return <ServiceChargeReport property={property} />;
      case 'document-inventory':
        return <DocumentInventoryReport property={property} />;
      case 'key-dates':
        return <KeyDatesReport properties={properties} />;
      case 'portfolio':
        return <PortfolioReport properties={properties} />;
      default:
        return <div>Invalid report type</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-md border">
      {renderReport()}
    </div>
  );
};

export default ReportPreview;
