import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PropertyDocument } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Folder, FolderPlus, Upload, Download, Trash2, FileUp, Search, RefreshCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { 
  FolderType, 
  uploadPropertyDocument, 
  getPropertyDocuments, 
  downloadDocument, 
  deleteDocument, 
  getPropertyFolderStructure 
} from '@/services/FileStorageService';

const fetchProperties = async (userId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  return data.map(property => ({
    id: property.id,
    name: property.name,
    address: property.address,
    rentalFee: Number(property.rental_fee),
    nextPaymentDate: property.next_payment_date,
    leaseExpiry: property.lease_expiry,
    createdAt: property.created_at,
    updatedAt: property.updated_at
  }));
};

const Documents = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string; path: string; type: FolderType } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: () => fetchProperties(user?.id || ''),
    enabled: !!user?.id
  });

  const { data: documents = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type],
    queryFn: () => getPropertyDocuments(selectedProperty?.id || '', selectedFolder?.type),
    enabled: !!selectedProperty?.id && !!selectedFolder
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!fileUpload || !selectedProperty || !selectedFolder) return null;
      
      return uploadPropertyDocument(
        selectedProperty.id,
        fileUpload,
        selectedFolder.type,
        documentName || fileUpload.name,
        documentDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type] });
      setUploadDialogOpen(false);
      resetUploadForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', selectedProperty?.id, selectedFolder?.type] });
    }
  });

  const resetUploadForm = () => {
    setFileUpload(null);
    setDocumentName('');
    setDocumentDescription('');
  };

  const filteredDocuments = searchQuery 
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : documents;

  const folderStructure = selectedProperty 
    ? getPropertyFolderStructure(selectedProperty.id)
    : [];

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedProperty(property || null);
    setSelectedFolder(null);
  };

  const handleFolderSelect = (folder: { id: string; name: string; path: string; type: FolderType }) => {
    setSelectedFolder(folder);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUpload = () => {
    if (!fileUpload) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return;
    }
    
    uploadMutation.mutate();
  };

  const handleDownload = (document: PropertyDocument) => {
    downloadDocument(document.filePath);
  };

  const handleDelete = (document: PropertyDocument) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      deleteMutation.mutate({ id: document.id, filePath: document.filePath });
    }
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
          <h1 className="text-3xl font-bold mb-6">Document Management</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                  <CardDescription>Select a property to view documents</CardDescription>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No properties found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {properties.map(property => (
                        <Button
                          key={property.id}
                          variant={selectedProperty?.id === property.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handlePropertySelect(property.id)}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          {property.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {selectedProperty && (
                <Card>
                  <CardHeader>
                    <CardTitle>Document Categories</CardTitle>
                    <CardDescription>Organize by document type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {folderStructure.map(folder => (
                        <Button
                          key={folder.id}
                          variant={selectedFolder?.id === folder.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handleFolderSelect(folder)}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          {folder.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-9">
              {!selectedProperty ? (
                <Card className="h-96 flex items-center justify-center text-center">
                  <CardContent>
                    <FolderPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Property</h3>
                    <p className="text-muted-foreground">Choose a property from the sidebar to view and manage its documents</p>
                  </CardContent>
                </Card>
              ) : !selectedFolder ? (
                <Card className="h-96 flex items-center justify-center text-center">
                  <CardContent>
                    <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Category</h3>
                    <p className="text-muted-foreground">Choose a document category to view and manage documents</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{selectedProperty.name} - {selectedFolder.name}</CardTitle>
                      <CardDescription>Manage your property documents</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>
                              Upload a document to {selectedFolder.name} for {selectedProperty.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <label htmlFor="document-file" className="text-sm font-medium">
                                Select File
                              </label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  id="document-file" 
                                  type="file" 
                                  onChange={handleFileSelect}
                                  className="flex-1"
                                />
                              </div>
                              {fileUpload && (
                                <p className="text-xs text-muted-foreground">
                                  Selected: {fileUpload.name} ({(fileUpload.size / 1024).toFixed(2)} KB)
                                </p>
                              )}
                            </div>
                            
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <label htmlFor="document-name" className="text-sm font-medium">
                                Document Name
                              </label>
                              <Input 
                                id="document-name" 
                                value={documentName} 
                                onChange={(e) => setDocumentName(e.target.value)}
                                placeholder="Enter document name"
                              />
                            </div>
                            
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <label htmlFor="document-description" className="text-sm font-medium">
                                Description (Optional)
                              </label>
                              <Textarea 
                                id="document-description" 
                                value={documentDescription} 
                                onChange={(e) => setDocumentDescription(e.target.value)}
                                placeholder="Enter document description"
                                rows={3}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleUpload}
                              disabled={!fileUpload || uploadMutation.isPending}
                            >
                              {uploadMutation.isPending ? (
                                <>
                                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <FileUp className="h-4 w-4 mr-2" />
                                  Upload
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" onClick={() => refetchDocuments()}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {documentsLoading ? (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredDocuments.length === 0 ? (
                      <div className="text-center py-12 border rounded-md border-dashed">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-1">No documents found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
                        </p>
                        {!searchQuery && (
                          <Button onClick={() => setUploadDialogOpen(true)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredDocuments.map((document) => (
                          <div 
                            key={document.id} 
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{document.name}</p>
                                {document.description && (
                                  <p className="text-sm text-muted-foreground">{document.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Uploaded {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownload(document)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(document)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
