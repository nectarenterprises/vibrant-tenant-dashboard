
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { uploadFile } from './storage';
import { saveDocumentMetadata } from './metadata';
import { FolderType } from './types';
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';

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
    console.log('Starting document upload process');
    // Generate a unique file path
    const fileExtension = file.name.split('.').pop() || '';
    const filePath = `${propertyId}/${documentType}/${uuidv4()}.${fileExtension}`;
    
    console.log(`Generated file path: ${filePath}`);
    
    // Upload the file to storage
    const uploadSuccess = await uploadFile(STORAGE_BUCKET, filePath, file);
    
    if (!uploadSuccess) {
      console.error('File upload failed');
      return false;
    }
    
    console.log('File uploaded successfully, saving metadata');
    
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
    
    console.log('Document upload complete:', !!metadata);
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
