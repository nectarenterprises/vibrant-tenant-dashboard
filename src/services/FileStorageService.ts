
import { toast } from '@/components/ui/use-toast';
import { uploadFile, downloadFile, deleteFile } from './document/storage';
import { 
  saveDocumentMetadata, 
  fetchDocumentMetadata, 
  deleteDocumentMetadata,
  updateDocumentMetadata,
  toggleDocumentFavorite,
  addDocumentVersion,
  getDocumentVersions,
  fetchRecentDocuments,
  updateDocumentAccessTimestamp,
  fetchExpiringDocuments
} from './document/metadata';
import { FolderType, DocumentVersion } from './document/types';
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';
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
  documentDescription?: string,
  tags?: DocumentTag[],
  expiryDate?: string,
  keyDates?: PropertyDocument['keyDates'],
  notificationPeriod?: number
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
      documentDescription,
      tags,
      expiryDate,
      keyDates,
      notificationPeriod
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
  documentType?: DocumentType,
  searchOptions?: {
    searchQuery?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    isFavorite?: boolean;
    sortBy?: 'date' | 'name' | 'type';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PropertyDocument[]> => {
  return fetchDocumentMetadata(propertyId, documentType, searchOptions);
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

/**
 * Updates document details
 */
export const updateDocument = async (
  documentId: string,
  updates: {
    name?: string;
    description?: string;
    tags?: DocumentTag[];
    isFavorite?: boolean;
    expiryDate?: string;
    keyDates?: PropertyDocument['keyDates'];
    notificationPeriod?: number;
  }
): Promise<boolean> => {
  return updateDocumentMetadata(documentId, updates);
};

/**
 * Toggle document favorite status
 */
export const toggleFavorite = async (
  documentId: string,
  isFavorite: boolean
): Promise<boolean> => {
  return toggleDocumentFavorite(documentId, isFavorite);
};

/**
 * Uploads a new version of an existing document
 */
export const uploadNewDocumentVersion = async (
  documentId: string,
  file: File,
  versionNotes?: string
): Promise<boolean> => {
  try {
    // Get document info to determine path
    const documents = await fetchDocumentMetadata('', undefined);
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      toast({
        variant: "destructive",
        title: "Document not found",
        description: "Could not find the document to update.",
      });
      return false;
    }
    
    // Generate a unique file path for the new version
    const fileExtension = file.name.split('.').pop() || '';
    const filePath = `${document.propertyId}/${document.documentType}/${uuidv4()}_v${(document.version || 1) + 1}.${fileExtension}`;
    
    // Upload the new file version
    const uploadSuccess = await uploadFile(STORAGE_BUCKET, filePath, file);
    
    if (!uploadSuccess) {
      return false;
    }
    
    // Update document metadata with version info
    return addDocumentVersion(documentId, filePath, versionNotes);
  } catch (error) {
    console.error('Error uploading document version:', error);
    toast({
      variant: "destructive",
      title: "Version upload failed",
      description: "There was an error uploading the new document version.",
    });
    return false;
  }
};

/**
 * Gets document version history
 */
export const getDocumentVersionHistory = async (documentId: string): Promise<DocumentVersion[]> => {
  return getDocumentVersions(documentId);
};

/**
 * Gets recently accessed documents
 */
export const getRecentDocuments = async (limit: number = 5): Promise<PropertyDocument[]> => {
  return fetchRecentDocuments(limit);
};

/**
 * Records document access
 */
export const recordDocumentAccess = async (documentId: string): Promise<void> => {
  await updateDocumentAccessTimestamp(documentId);
};

/**
 * Gets documents that are expiring soon
 */
export const getExpiringDocuments = async (daysThreshold: number = 90): Promise<PropertyDocument[]> => {
  return fetchExpiringDocuments(daysThreshold);
};
