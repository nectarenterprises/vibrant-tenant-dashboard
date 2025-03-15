import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PropertyDocument } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { getPropertyDocuments, downloadDocument, deleteDocument, updateDocumentAccessTimestamp } from '@/services/FileStorageService';
import DocumentSectionHeader from './documents/DocumentSectionHeader';
import DocumentsList from './documents/DocumentsList';
import EmptyDocumentState from './documents/EmptyDocumentState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
      const docs = await getPropertyDocuments();
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
    await downloadDocument(document.filePath, document.name);
    await updateDocumentAccessTimestamp(document.id);
    
    toast({
      title: "Document downloaded",
      description: `${document.name} has been downloaded successfully.`
    });
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
      <CardHeader className="pb-2">
        <DocumentSectionHeader 
          hasDocuments={documents.length > 0}
          expanded={expanded}
          toggleExpand={toggleExpand}
          onAddDocument={() => setShowDocumentDialog(true)}
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner className="h-20" size="sm" />
        ) : documents.length === 0 ? (
          <EmptyDocumentState onUploadClick={() => setShowDocumentDialog(true)} />
        ) : (
          <DocumentsList 
            documents={documents}
            expanded={expanded}
            toggleExpand={toggleExpand}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
