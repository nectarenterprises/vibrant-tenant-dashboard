
// Export all document-related services from a single entry point
export { 
  uploadPropertyDocument 
} from './fileUpload';

export { 
  downloadDocument 
} from './fileDownload';

export { 
  deleteDocument 
} from './fileDelete';

export { 
  updateDocument,
  toggleFavorite,
  uploadNewDocumentVersion
} from './fileUpdate';

export {
  getPropertyDocuments,
  getDocumentVersionHistory,
  getRecentDocuments,
  getExpiringDocuments
} from './fileQuery';

// Export the file access function
export {
  recordDocumentAccess
} from './fileAccess';
