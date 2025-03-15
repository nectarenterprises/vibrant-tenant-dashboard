
import { toast } from '@/components/ui/use-toast';
import { deleteFile } from './storage';
import { deleteDocumentMetadata } from './metadata';

const STORAGE_BUCKET = 'documents';

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
