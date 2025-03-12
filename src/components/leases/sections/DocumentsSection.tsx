
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Upload, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getPropertyDocuments, downloadDocument, deleteDocument } from '@/services/FileStorageService';
import { PropertyDocument } from '@/types/property';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface DocumentsSectionProps {
  setShowDocumentDialog: (show: boolean) => void;
  propertyId: string;
}

const DocumentsSection = ({ setShowDocumentDialog, propertyId }: DocumentsSectionProps) => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchDocuments = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    try {
      const docs = await getPropertyDocuments(propertyId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [propertyId]);

  const handleDownload = async (document: PropertyDocument) => {
    await downloadDocument(document.filePath);
  };

  const handleDelete = async (document: PropertyDocument) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${document.name}"?`);
    if (!confirmed) return;

    try {
      const success = await deleteDocument(document.id, document.filePath);
      if (success) {
        setDocuments(docs => docs.filter(d => d.id !== document.id));
        toast({
          title: "Document deleted",
          description: `${document.name} has been deleted successfully.`,
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Documents</CardTitle>
        <div className="flex items-center space-x-1">
          {documents.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleExpand}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowDocumentDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
            <p className="text-muted-foreground">No documents uploaded</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setShowDocumentDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {!expanded ? (
              <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{documents[0].name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(documents[0].uploadDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownload(documents[0])}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(documents[0])}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              documents.map((document) => (
                <div 
                  key={document.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(document)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-center mt-2">
              {documents.length > 1 && !expanded && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleExpand}
                  className="text-xs"
                >
                  View all {documents.length} documents
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              )}
              {expanded && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleExpand}
                  className="text-xs"
                >
                  Collapse
                  <ChevronUp className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
