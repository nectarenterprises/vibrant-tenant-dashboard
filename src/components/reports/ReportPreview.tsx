
import React from 'react';
import { ReportType } from '@/types/report';
import { Property } from '@/types/property';

interface ReportPreviewProps {
  reportType: ReportType;
  property: Property;
  properties: Property[];
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportType, property, properties }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Preview for {reportType}</h3>
      <p>Property: {property.name}</p>
      <p>This is a placeholder for the report preview.</p>
    </div>
  );
};

export default ReportPreview;
