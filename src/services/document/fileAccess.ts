
import { updateDocumentAccessTimestamp } from './metadata';

/**
 * Records document access
 */
export const recordDocumentAccess = async (documentId: string): Promise<void> => {
  await updateDocumentAccessTimestamp(documentId);
};
