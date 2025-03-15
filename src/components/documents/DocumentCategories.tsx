
import React, { useState, useEffect } from 'react';
import { Property, PropertyDocument } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocumentQueries } from '@/hooks/documents/useDocumentQueries';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import { useDocumentMutations } from '@/hooks/documents/useDocumentMutations';
import CategoryCard from './categories/CategoryCard';
import UploadDialog from './UploadDialog';
import { FolderType } from '@/services/document/types';

interface DocumentCategoriesProps {
  property: Property;
}

const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ property }) => {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Document counts state
  const [documentCounts, setDocumentCounts] = useState({
    lease: 0,
    utility: 0,
    compliance: 0,
    'service-charge': 0
  });
  
  // Document upload state
  const {
    fileUpload,
    documentName,
    documentDescription,
    documentType,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  } = useDocumentUpload();
  
  // Document mutations - handle document uploads
  const { uploadMutation } = useDocumentMutations(property.id, resetUploadForm);
  
  // Document queries hook
  const { getDocumentsByType } = useDocumentQueries(property.id, undefined);
  
  // Fetch document counts on component mount
  useEffect(() => {
    const fetchDocumentCounts = async () => {
      const leaseCount = await getDocumentsByType(property.id, 'lease');
      const utilityCount = await getDocumentsByType(property.id, 'utility');
      const complianceCount = await getDocumentsByType(property.id, 'compliance');
      const serviceChargeCount = await getDocumentsByType(property.id, 'service-charge');
      
      setDocumentCounts({
        lease: leaseCount.length,
        utility: utilityCount.length,
        compliance: complianceCount.length,
        'service-charge': serviceChargeCount.length
      });
    };
    
    fetchDocumentCounts();
  }, [property.id, getDocumentsByType]);
  
  // Handle document upload
  const handleUpload = () => {
    const uploadData = prepareUpload();
    if (uploadData) {
      uploadMutation.mutate(uploadData);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{property.name} Documents</h2>
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-6 bg-tenant-green hover:bg-tenant-darkGreen"
          size="lg"
        >
          <Upload className="h-5 w-5" />
          Upload Files
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryCard
          title="Lease Documents"
          icon={<FileText className="h-5 w-5 text-white" />}
          count={documentCounts.lease}
          onClick={() => navigate(`/documents/${property.id}/lease`)}
          bgColor="bg-tenant-green"
        />
        
        <CategoryCard
          title="Utility Bills"
          icon={<FileText className="h-5 w-5 text-white" />}
          count={documentCounts.utility}
          onClick={() => navigate(`/documents/${property.id}/utility`)}
          bgColor="bg-tenant-green"
        />
        
        <CategoryCard
          title="Compliance Documents"
          icon={<FileText className="h-5 w-5 text-white" />} 
          count={documentCounts.compliance}
          onClick={() => navigate(`/documents/${property.id}/compliance`)}
          bgColor="bg-tenant-green"
        />
        
        <CategoryCard
          title="Service Charge Budgets"
          icon={<FileText className="h-5 w-5 text-white" />}
          count={documentCounts['service-charge']}
          onClick={() => navigate(`/documents/${property.id}/service-charge`)}
          bgColor="bg-tenant-green"
        />
      </div>
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        setIsOpen={setUploadDialogOpen}
        fileUpload={fileUpload}
        documentName={documentName}
        documentDescription={documentDescription}
        documentType={documentType}
        isUploading={uploadMutation.isPending}
        onFileSelect={handleFileSelect}
        onNameChange={setDocumentName}
        onDescriptionChange={setDocumentDescription}
        onTypeChange={setDocumentType}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default DocumentCategories;
