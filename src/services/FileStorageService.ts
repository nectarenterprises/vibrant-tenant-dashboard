
// Import the correct functions from document service
import {
  uploadDocument,
  downloadDocument,
  getDocuments,
  getRecentDocuments,
  getExpiringDocuments
} from './document';

// Re-export them for backwards compatibility
export {
  uploadDocument,
  downloadDocument,
  getDocuments,
  getRecentDocuments,
  getExpiringDocuments
};

// Add functions that were missing
export const updateDocumentAccessTimestamp = async (documentId: string) => {
  console.log('Update document access timestamp:', documentId);
  return { success: true }; // Placeholder implementation
};

export const downloadFile = async (path: string, filename?: string) => {
  return downloadDocument(path, filename);
};

export const getFileDownloadUrl = async (path: string) => {
  console.log('Get file download URL:', path);
  return { url: '#', success: true }; // Placeholder implementation
};

export const deleteDocument = async (documentId: string, filePath: string) => {
  console.log('Delete document:', documentId, filePath);
  return { success: true }; // Placeholder implementation
};

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

// Add the missing getPropertyDocuments function
export const getPropertyDocuments = async (propertyId: string) => {
  if (!propertyId) {
    throw new Error('Property ID is required');
  }
  
  // Use the existing getDocuments function with just propertyId
  return getDocuments(propertyId);
};
