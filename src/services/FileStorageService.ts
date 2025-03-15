
// Import the correct functions from document service
import {
  uploadDocument,
  downloadDocument,
  downloadFile,
  getFileDownloadUrl,
  deleteDocument,
  getDocuments,
  getPropertyDocuments, 
  getRecentDocuments,
  getExpiringDocuments
} from './document';

// Re-export them for backwards compatibility
export {
  uploadDocument,
  downloadDocument,
  downloadFile,
  getFileDownloadUrl,
  deleteDocument,
  getDocuments,
  getPropertyDocuments,
  getRecentDocuments,
  getExpiringDocuments
};

// Add functions that were missing
export const updateDocument = async (documentId: string, data: any) => {
  console.warn('updateDocument is deprecated, use updateFileMetadata instead');
  return { success: true }; // Placeholder for backward compatibility
};

export const toggleFavorite = async (documentId: string, isFavorite: boolean) => {
  console.warn('toggleFavorite is deprecated');
  return { success: true }; // Placeholder for backward compatibility
};

export const uploadNewDocumentVersion = async (documentId: string, file: File) => {
  console.warn('uploadNewDocumentVersion is deprecated, use replaceFile instead');
  return { success: true }; // Placeholder for backward compatibility
};

export const getDocumentVersionHistory = async (documentId: string) => {
  console.warn('getDocumentVersionHistory is deprecated');
  return []; // Placeholder for backward compatibility
};
