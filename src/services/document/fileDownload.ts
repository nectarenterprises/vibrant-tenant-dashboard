
import { toast } from '@/components/ui/use-toast';
import { downloadFile } from './storage';

const STORAGE_BUCKET = 'documents';

/**
 * Downloads a document
 */
export const downloadDocument = async (filePath: string): Promise<void> => {
  console.log(`Downloading document: ${filePath}`);
  await downloadFile(STORAGE_BUCKET, filePath);
};
