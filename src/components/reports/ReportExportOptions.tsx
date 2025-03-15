
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { FileIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { ReportType } from '@/types/report';

interface ReportExportOptionsProps {
  reportType: ReportType;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

const ReportExportOptions: React.FC<ReportExportOptionsProps> = ({ reportType, onExport }) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  
  // Options vary based on report type
  const getSectionOptions = () => {
    switch (reportType) {
      case 'property-summary':
        return [
          { id: 'overview', label: 'Property Overview' },
          { id: 'financial', label: 'Financial Summary' },
          { id: 'key-dates', label: 'Key Dates' },
          { id: 'contacts', label: 'Contact Information' }
        ];
      case 'service-charge':
        return [
          { id: 'summary', label: 'Service Charge Summary' },
          { id: 'comparison', label: 'Year-over-Year Comparison' },
          { id: 'breakdown', label: 'Category Breakdown' },
          { id: 'trends', label: 'Trend Analysis' }
        ];
      case 'document-inventory':
        return [
          { id: 'leases', label: 'Lease Documents' },
          { id: 'compliance', label: 'Compliance Documents' },
          { id: 'utilities', label: 'Utility Documents' },
          { id: 'correspondence', label: 'Correspondence' }
        ];
      case 'key-dates':
        return [
          { id: 'leases', label: 'Lease Dates' },
          { id: 'compliance', label: 'Compliance Due Dates' },
          { id: 'payments', label: 'Payment Schedules' },
          { id: 'inspections', label: 'Inspection Dates' }
        ];
      case 'portfolio':
        return [
          { id: 'summary', label: 'Portfolio Summary' },
          { id: 'properties', label: 'Property Listing' },
          { id: 'financial', label: 'Financial Overview' },
          { id: 'performance', label: 'Performance Metrics' }
        ];
      default:
        return [];
    }
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: <FileIcon className="mr-2 h-4 w-4" /> },
    { value: 'excel', label: 'Excel Spreadsheet', icon: <FileSpreadsheet className="mr-2 h-4 w-4" /> },
    { value: 'csv', label: 'CSV File', icon: <FileText className="mr-2 h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Export Format</h3>
          <RadioGroup 
            defaultValue="pdf" 
            value={format} 
            onValueChange={(value) => setFormat(value as 'pdf' | 'excel' | 'csv')}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {formatOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem 
                  value={option.value} 
                  id={`format-${option.value}`}
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`format-${option.value}`}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex flex-col items-center gap-1">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Include Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {getSectionOptions().map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={`section-${option.id}`} defaultChecked />
                <Label htmlFor={`section-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Additional Options</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="include-company-branding" defaultChecked />
              <Label htmlFor="include-company-branding">Include company branding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-charts" defaultChecked />
              <Label htmlFor="include-charts">Include charts and graphs</Label>
            </div>
            {format === 'pdf' && (
              <div className="flex items-center space-x-2">
                <Checkbox id="include-appendix" />
                <Label htmlFor="include-appendix">Include appendix with raw data</Label>
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="button" onClick={() => onExport(format)}>
          Generate Report
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ReportExportOptions;
