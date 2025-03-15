
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
    console.log(`Deleting document: ${documentId}, filePath: ${filePath}`);
    
    // Delete the file from storage
    const deleteFileSuccess = await deleteFile(STORAGE_BUCKET, filePath);
    
    if (!deleteFileSuccess) {
      console.error('Failed to delete file from storage');
      return false;
    }
    
    console.log('File deleted from storage, now deleting metadata');
    
    // Delete document metadata
    const deleteMetadataSuccess = await deleteDocumentMetadata(documentId);
    
    console.log('Document deletion complete:', deleteMetadataSuccess);
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
