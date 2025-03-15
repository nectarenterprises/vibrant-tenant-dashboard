
import { toast } from '@/components/ui/use-toast';
import { downloadFile } from './storage';
import { recordDocumentAccess } from './fileAccess';

const STORAGE_BUCKET = 'documents';

/**
 * Downloads a document and records the access
 */
export const downloadDocument = async (filePath: string, documentId?: string): Promise<void> => {
  console.log(`Downloading document: ${filePath}`);
  
  // Download the file
  await downloadFile(STORAGE_BUCKET, filePath);
  
  // Record document access if documentId is provided
  if (documentId) {
    await recordDocumentAccess(documentId);
  }
};
