
import { toast } from '@/components/ui/use-toast';
import { uploadFile, downloadFile, deleteFile } from './document/storage';
import { saveDocumentMetadata, fetchDocumentMetadata, deleteDocumentMetadata } from './document/metadata';
import { FolderType } from './document/types';
import { PropertyDocument, DocumentType } from '@/types/property';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'documents';

/**
 * Uploads a document and saves its metadata
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  documentType: DocumentType,
  documentName: string,
  documentDescription?: string
): Promise<boolean> => {
  try {
    // Generate a unique file path
    const fileExtension = file.name.split('.').pop() || '';
    const filePath = `${propertyId}/${documentType}/${uuidv4()}.${fileExtension}`;
    
    // Upload the file to storage
    const uploadSuccess = await uploadFile(STORAGE_BUCKET, filePath, file);
    
    if (!uploadSuccess) {
      return false;
    }
    
    // Save document metadata
    const docType = documentType as FolderType; // Type assertion since DocumentType and FolderType are the same
    const metadata = await saveDocumentMetadata(
      propertyId,
      documentName,
      filePath,
      docType,
      documentDescription
    );
    
    return !!metadata;
  } catch (error) {
    console.error('Error uploading document:', error);
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: "There was an error uploading your document.",
    });
    return false;
  }
};

/**
 * Fetches all documents for a property
 */
export const getPropertyDocuments = async (
  propertyId: string,
  documentType?: DocumentType
): Promise<PropertyDocument[]> => {
  return fetchDocumentMetadata(propertyId, documentType);
};

/**
 * Downloads a document
 */
export const downloadDocument = async (filePath: string): Promise<void> => {
  await downloadFile(STORAGE_BUCKET, filePath);
};

/**
 * Deletes a document and its metadata
 */
export const deleteDocument = async (
  documentId: string,
  filePath: string
): Promise<boolean> => {
  try {
    // Delete the file from storage
    const deleteFileSuccess = await deleteFile(STORAGE_BUCKET, filePath);
    
    if (!deleteFileSuccess) {
      return false;
    }
    
    // Delete document metadata
    const deleteMetadataSuccess = await deleteDocumentMetadata(documentId);
    
    return deleteMetadataSuccess;
  } catch (error) {
    console.error('Error deleting document:', error);
    toast({
      variant: "destructive",
      title: "Delete failed",
      description: "There was an error deleting the document.",
    });
    return false;
  }
};
