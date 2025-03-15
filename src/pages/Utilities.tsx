import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Property, PropertyDocument } from '@/types/property';
import { cn } from '@/lib/utils';
import { Search, Zap, Download, Trash2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ElectricityChart from '@/components/utilities/ElectricityChart';
import WaterChart from '@/components/utilities/WaterChart';
import GasChart from '@/components/utilities/GasChart';
import { getPropertyDocuments, downloadDocument, deleteDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';
import UploadDialog from '@/components/documents/UploadDialog';
import { FolderType } from '@/services/document/types';

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Victoria Office',
    address: '123 Buckingham Palace Road, Victoria, London SW1W 9SH',
    rentalFee: 3500,
    nextPaymentDate: '2023-04-15',
    leaseExpiry: '2024-03-31',
    incentives: [] // Add required incentives array
  },
  {
    id: '2',
    name: 'Covent Garden Retail',
    address: '45 Long Acre, Covent Garden, London WC2E 9JT',
    rentalFee: 4200,
    nextPaymentDate: '2023-04-10',
    leaseExpiry: '2023-12-31',
    incentives: [] // Add required incentives array
  }
];

const Utilities = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [utilityDocuments, setUtilityDocuments] = useState<PropertyDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<FolderType>('utility');
  
  const filteredProperties = mockProperties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedProperty) {
      fetchUtilityDocuments(selectedProperty.id);
    }
  }, [selectedProperty]);

  const fetchUtilityDocuments = async (propertyId: string) => {
    setDocumentsLoading(true);
    try {
      const documents = await getPropertyDocuments(propertyId, documentType);
      setUtilityDocuments(documents);
    } catch (error) {
      console.error('Error fetching utility documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch utility documents.",
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDownload = async (document: PropertyDocument) => {
    try {
      await downloadDocument(document.filePath);
      toast({
        title: "Download started",
        description: `${document.name} is being downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document.",
      });
    }
  };

  const handleDelete = async (document: PropertyDocument) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) return;
    
    try {
      const success = await deleteDocument(document.id, document.filePath);
      if (success) {
        setUtilityDocuments(docs => docs.filter(d => d.id !== document.id));
        toast({
          title: "Document deleted",
          description: `${document.name} has been deleted.`,
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the document.",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileUpload || !selectedProperty) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a file to upload.",
      });
      return;
    }

    setUploadDialogOpen(false);
    toast({
      title: "Upload functionality",
      description: "Full upload functionality would be implemented here.",
    });
    
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">Utilities Dashboard</h1>
            <p className="text-muted-foreground">Monitor your property's utility usage and costs</p>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedProperty ? (
            <div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
              >
                ← Back to all properties
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-bl-full -mr-6 -mt-6"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Zap className="h-6 w-6 text-tenant-green" />
                        </div>
                        <h2 className="text-2xl font-bold">{selectedProperty.name} - Utilities</h2>
                      </div>
                      
                      <p className="text-muted-foreground mb-6">View and analyze your utility consumption patterns and costs</p>
                      
                      <div className="space-y-6">
                        <ElectricityChart />
                        <WaterChart />
                        <GasChart />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-md">Utility Documents</CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {documentsLoading ? (
                        <div className="flex items-center justify-center h-20">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      ) : utilityDocuments.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-4">No utility documents found</p>
                          <Button 
                            variant="outline" 
                            onClick={() => setUploadDialogOpen(true)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Utility Bill
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {utilityDocuments.map((document) => (
                            <div 
                              key={document.id} 
                              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <p className="font-medium text-sm">{document.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(document.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDownload(document)}
                                  className="h-8 w-8"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDelete(document)}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <div 
                    key={property.id} 
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <PropertyCard 
                      property={property} 
                      delay={index} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p>No properties found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        setIsOpen={setUploadDialogOpen}
        fileUpload={fileUpload}
        documentName={documentName}
        documentDescription={documentDescription}
        documentType={documentType}
        isUploading={false}
        onFileSelect={handleFileSelect}
        onNameChange={setDocumentName}
        onDescriptionChange={setDocumentDescription}
        onTypeChange={setDocumentType}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Utilities;
