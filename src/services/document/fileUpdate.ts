
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from './storage';
import { updateDocumentMetadata, toggleDocumentFavorite, addDocumentVersion, fetchDocumentMetadata } from './metadata';
import { PropertyDocument, DocumentTag } from '@/types/property';

const STORAGE_BUCKET = 'documents';

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
    console.log(`Uploading new version for document: ${documentId}`);
    
    // Get document info to determine path
    const documents = await fetchDocumentMetadata('', undefined);
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      console.error('Document not found');
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
    
    console.log(`Generated new version path: ${filePath}`);
    
    // Upload the new file version
    const uploadSuccess = await uploadFile(STORAGE_BUCKET, filePath, file);
    
    if (!uploadSuccess) {
      console.error('Failed to upload new version');
      return false;
    }
    
    console.log('New version uploaded, updating metadata');
    
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
