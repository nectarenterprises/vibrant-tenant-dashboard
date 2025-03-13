
import { PropertyDocument } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadFile, downloadFile, deleteFile, getFilePublicUrl } from './document/storage';
import { saveDocumentMetadata, fetchDocumentMetadata, deleteDocumentMetadata } from './document/metadata';
import { createDocumentPath } from './document/folders';
import { FolderType, DOCUMENT_TYPES, getPropertyFolderStructure } from './document/types';

const STORAGE_BUCKET = 'property_documents';

// Re-export types and functions
export type { FolderType };
export { DOCUMENT_TYPES, getPropertyFolderStructure };

/**
 * Uploads a property document to Supabase Storage and saves its metadata
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  documentType: FolderType,
  name?: string,
  description?: string
): Promise<PropertyDocument | null> => {
  try {
    // Get file path
    const filePath = createDocumentPath(propertyId, documentType, file.name);
    const fileName = name || file.name;

    // Upload the file to Supabase Storage
    const uploaded = await uploadFile(STORAGE_BUCKET, filePath, file);
    if (!uploaded) return null;

    // Save document metadata to the database
    const document = await saveDocumentMetadata(
      propertyId,
      fileName,
      filePath,
      documentType,
      description
    );

    if (document) {
      toast({
        title: "Document uploaded",
        description: `${fileName} has been uploaded successfully.`,
      });
    }

    return document;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: error.message || "An error occurred during upload",
    });
    return null;
  }
};

/**
 * Fetches property documents from the database
 */
export const getPropertyDocuments = async (
  propertyId: string, 
  documentType?: FolderType
): Promise<PropertyDocument[]> => {
  return fetchDocumentMetadata(propertyId, documentType);
};

/**
 * Downloads a document from Supabase Storage
 */
export const downloadDocument = async (filePath: string): Promise<void> => {
  return downloadFile(STORAGE_BUCKET, filePath);
};

/**
 * Deletes a document from Supabase Storage and its metadata from the database
 */
export const deleteDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  try {
    // Delete from storage
    const storageDeleted = await deleteFile(STORAGE_BUCKET, filePath);
    if (!storageDeleted) return false;
    
    // Delete metadata from database
    const metadataDeleted = await deleteDocumentMetadata(documentId);
    if (!metadataDeleted) return false;
    
    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Delete failed",
      description: error.message || "An error occurred while deleting the document",
    });
    return false;
  }
};

/**
 * Gets the public URL for a document
 */
export const getDocumentPublicUrl = (filePath: string): string => {
  return getFilePublicUrl(STORAGE_BUCKET, filePath);
};
