
// Import from the correct services
import { uploadFile, uploadPropertyDocument, uploadDocument } from './fileUpload';
import { 
  downloadFile, 
  getFileDownloadUrl,
  downloadDocument
} from './fileDownload';
import { deleteFile, deleteDocument } from './fileDelete';
import {
  updateFileMetadata,
  replaceFile
} from './fileUpdate';
import { 
  getDocuments, 
  searchDocuments, 
  getDocumentById,
  getDocumentsByFolderId,
  getRecentDocuments,
  getExpiringDocuments
} from './fileQuery';
import { recordDocumentAccess } from './access';

// Export all functions
export {
  uploadFile,
  uploadPropertyDocument,
  uploadDocument,
  downloadFile,
  getFileDownloadUrl,
  downloadDocument,
  deleteFile,
  deleteDocument,
  updateFileMetadata,
  replaceFile,
  getDocuments,
  searchDocuments,
  getDocumentById,
  getDocumentsByFolderId,
  getRecentDocuments,
  getExpiringDocuments,
  recordDocumentAccess
};
