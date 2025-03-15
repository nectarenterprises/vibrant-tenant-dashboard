import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PropertyDocument } from '@/types/property';
import { LucideIcon, Download, File } from 'lucide-react';
import UtilityBaseChart from './shared/UtilityBaseChart';
import { getPropertyDocuments } from '@/services/FileStorageService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { downloadDocument, updateDocumentAccessTimestamp } from '@/services/document';

interface UtilityDetailViewProps {
  title: string;
  data: Array<{ month: string; usage: number; cost: number }>;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
  onBack: () => void;
  propertyId: string;
  utilityType: 'electricity' | 'water' | 'gas';
}

const UtilityDetailView: React.FC<UtilityDetailViewProps> = ({
  title,
  data,
  Icon,
  iconColor,
  iconBgColor,
  primaryColor,
  secondaryColor,
  usageUnit,
  onBack,
  propertyId,
  utilityType
}) => {
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
  const totalCost = data.reduce((acc, item) => acc + item.cost, 0);
  const averageUsage = totalUsage / data.length || 0;
  const averageCost = totalCost / data.length || 0;

  useEffect(() => {
    const fetchUtilityDocuments = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      try {
        const documents = await getPropertyDocuments(propertyId, 'utility');
        const filteredDocs = documents.filter(doc => {
          const searchText = `${doc.name.toLowerCase()} ${doc.description?.toLowerCase() || ''}`;
          return searchText.includes(utilityType.toLowerCase());
        });
        
        setUtilityDocuments(filteredDocs);
      } catch (error) {
        console.error('Error fetching utility documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilityDocuments();
  }, [propertyId, utilityType]);

  const handleDownload = async (document: any) => {
    try {
      await downloadDocument(document.filePath, document.name);
      updateDocumentAccessTimestamp(document.id);
      
      toast({
        title: "Document downloaded",
        description: `${document.name} has been downloaded successfully.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document."
      });
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
      >
        ← Back to utilities overview
      </button>

      <div className="flex items-center gap-2 mb-4">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title} Detail View</h2>
      </div>

      <UtilityBaseChart
        data={data}
        title={title}
        Icon={Icon}
        iconColor={iconColor}
        iconBgColor={iconBgColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        usageUnit={usageUnit}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsage.toLocaleString()} {usageUnit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">£{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{averageUsage.toLocaleString(undefined, { maximumFractionDigits: 0 })} {usageUnit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">£{averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Usage ({usageUnit})</TableHead>
                <TableHead>Cost (£)</TableHead>
                <TableHead>Unit Rate (£/{usageUnit})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell>{item.usage.toLocaleString()}</TableCell>
                  <TableCell>£{item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    £{(item.cost / item.usage).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title} Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : utilityDocuments.length === 0 ? (
            <div className="text-center py-8 border rounded-md border-dashed">
              <File className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No {utilityType} invoices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {utilityDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(document.uploadDate).toLocaleDateString()} • {document.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityDetailView;
