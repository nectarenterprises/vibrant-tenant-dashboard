
// Re-export all document services from the document module
export { 
  uploadPropertyDocument,
  downloadDocument,
  deleteDocument,
  updateDocument,
  toggleFavorite,
  uploadNewDocumentVersion,
  getPropertyDocuments,
  getDocumentVersionHistory,
  getRecentDocuments,
  recordDocumentAccess,
  getExpiringDocuments
} from './document';
