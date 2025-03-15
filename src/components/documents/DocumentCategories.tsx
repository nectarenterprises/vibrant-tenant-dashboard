
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocumentQueries } from '@/hooks/documents/useDocumentQueries';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import { useDocumentMutations } from '@/hooks/documents/useDocumentMutations';
import CategoryCard from './categories/CategoryCard';
import UploadDialog from './UploadDialog';

interface DocumentCategoriesProps {
  property: Property;
}

const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ property }) => {
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
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
  
  // Handle document upload
  const handleUpload = () => {
    const uploadData = prepareUpload();
    if (uploadData) {
      uploadMutation.mutate(uploadData);
    }
  };
  
  // Get document counts for each category
  const { getDocumentsByType } = useDocumentQueries(property.id);
  const leaseDocuments = getDocumentsByType('lease');
  const utilityDocuments = getDocumentsByType('utility');
  const complianceDocuments = getDocumentsByType('compliance');
  const serviceChargeDocuments = getDocumentsByType('service-charge');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{property.name} Documents</h2>
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryCard
          title="Lease Documents"
          icon={<FileText className="h-8 w-8 text-tenant-yellow" />}
          count={leaseDocuments.length}
          onClick={() => navigate(`/documents/${property.id}/lease`)}
        />
        
        <CategoryCard
          title="Utility Documents"
          icon={<FileText className="h-8 w-8 text-tenant-green" />}
          count={utilityDocuments.length}
          onClick={() => navigate(`/documents/${property.id}/utility`)}
        />
        
        <CategoryCard
          title="Compliance Documents"
          icon={<FileText className="h-8 w-8 text-tenant-blue" />} 
          count={complianceDocuments.length}
          onClick={() => navigate(`/documents/${property.id}/compliance`)}
        />
        
        <CategoryCard
          title="Service Charge Documents"
          icon={<FileText className="h-8 w-8 text-tenant-orange" />}
          count={serviceChargeDocuments.length}
          onClick={() => navigate(`/documents/${property.id}/service-charge`)}
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
