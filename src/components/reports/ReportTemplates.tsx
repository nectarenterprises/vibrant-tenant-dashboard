
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, BarChart2, Calendar, Building, FileSpreadsheet, Download, Eye, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReportPreview from './ReportPreview';
import ReportExportOptions from './ReportExportOptions';
import { toast } from '@/components/ui/use-toast';
import { ReportType } from '@/types/report';

interface ReportTemplatesProps {
  properties: Property[];
  isLoading: boolean;
}

const ReportTemplates: React.FC<ReportTemplatesProps> = ({ properties, isLoading }) => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePreview = (reportType: ReportType, property?: Property) => {
    setSelectedReport(reportType);
    setSelectedProperty(property || (properties.length > 0 ? properties[0] : null));
    setPreviewOpen(true);
  };

  const handleExport = (reportType: ReportType, property?: Property) => {
    setSelectedReport(reportType);
    setSelectedProperty(property || (properties.length > 0 ? properties[0] : null));
    setExportOpen(true);
  };

  const handleGenerateReport = (format: 'pdf' | 'excel' | 'csv') => {
    toast({
      title: "Report generation started",
      description: `Your ${selectedReport} report is being prepared in ${format.toUpperCase()} format.`,
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: `Your ${selectedReport} report has been generated successfully.`,
      });
      setExportOpen(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const reportTemplates = [
    {
      id: 'property-summary',
      title: 'Property Summary',
      description: 'Key details, costs, and important dates for a specific property',
      icon: <FileText className="h-8 w-8 text-primary" />,
      type: 'property-summary' as ReportType,
      requiresProperty: true
    },
    {
      id: 'service-charge',
      title: 'Service Charge Analysis',
      description: 'Year-over-year comparison of service charges by category',
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      type: 'service-charge' as ReportType,
      requiresProperty: true
    },
    {
      id: 'document-inventory',
      title: 'Document Inventory',
      description: 'Complete listing of all documents organized by type',
      icon: <FileSpreadsheet className="h-8 w-8 text-primary" />,
      type: 'document-inventory' as ReportType,
      requiresProperty: true
    },
    {
      id: 'key-dates',
      title: 'Key Dates Timeline',
      description: 'Timeline of upcoming critical dates and deadlines',
      icon: <Calendar className="h-8 w-8 text-primary" />,
      type: 'key-dates' as ReportType,
      requiresProperty: false
    },
    {
      id: 'portfolio',
      title: 'Portfolio Overview',
      description: 'Summary of all properties in your portfolio',
      icon: <Building className="h-8 w-8 text-primary" />,
      type: 'portfolio' as ReportType,
      requiresProperty: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  {template.icon}
                </div>
              </div>
              <CardTitle className="mt-4">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePreview(template.type)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleExport(template.type)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              Preview of {selectedReport} report
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && selectedReport && (
            <ReportPreview 
              reportType={selectedReport} 
              property={selectedProperty} 
              properties={properties}
            />
          )}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setPreviewOpen(false);
              setExportOpen(true);
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Choose export format and options
            </DialogDescription>
          </DialogHeader>
          
          <ReportExportOptions 
            reportType={selectedReport || 'property-summary'} 
            onExport={handleGenerateReport}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportTemplates;
