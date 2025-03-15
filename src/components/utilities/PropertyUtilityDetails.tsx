
import React, { useState } from 'react';
import { Property, PropertyDocument } from '@/types/property';
import UtilityDashboard from './UtilityDashboard';
import UtilityDocuments from './UtilityDocuments';
import { FolderType } from '@/services/document/types';
import { toast } from '@/components/ui/use-toast';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import { uploadPropertyDocument } from '@/services/document/fileUpload';
import { downloadDocument, deleteDocument } from '@/services/FileStorageService';
import UploadDialog from '@/components/documents/UploadDialog';

interface PropertyUtilityDetailsProps {
  property: Property;
  utilityDocuments: PropertyDocument[];
  documentsLoading: boolean;
  documentType: FolderType;
  onBack: () => void;
  onUploadClick: () => void;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
  refetchDocuments: () => void;
}

const PropertyUtilityDetails: React.FC<PropertyUtilityDetailsProps> = ({
  property,
  utilityDocuments,
  documentsLoading,
  documentType,
  onBack,
  onUploadClick,
  onDownload,
  onDelete,
  refetchDocuments
}) => {
  const {
    fileUpload,
    documentName,
    documentDescription,
    documentType: selectedDocType,
    uploadDialogOpen,
    isUploading,
    setFileUpload,
    setDocumentName,
    setDocumentDescription,
    setDocumentType,
    setUploadDialogOpen,
    setIsUploading,
    resetUploadForm,
    handleFileSelect,
    prepareUpload
  } = useDocumentUpload();

  const handleUpload = async () => {
    const uploadData = prepareUpload();
    
    if (!uploadData) return;
    
    setIsUploading(true);
    
    try {
      const result = await uploadPropertyDocument(
        property.id,
        uploadData.file,
        uploadData.documentType as DocumentType,
        uploadData.name,
        uploadData.description
      );
      
      if (result) {
        toast({
          title: "Document uploaded",
          description: "Your utility document has been uploaded successfully.",
        });
        resetUploadForm();
        refetchDocuments();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-4 text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
      >
        ← Back to all properties
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <UtilityDashboard property={property} />
        </div>
        
        <div>
          <UtilityDocuments 
            utilityDocuments={utilityDocuments}
            documentsLoading={documentsLoading}
            documentType={documentType}
            onUploadClick={() => setUploadDialogOpen(true)}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      </div>
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        setIsOpen={setUploadDialogOpen}
        fileUpload={fileUpload}
        documentName={documentName}
        documentDescription={documentDescription}
        documentType={selectedDocType}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        onNameChange={setDocumentName}
        onDescriptionChange={setDocumentDescription}
        onTypeChange={setDocumentType}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default PropertyUtilityDetails;
