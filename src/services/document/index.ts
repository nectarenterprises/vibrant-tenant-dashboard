
// Import from the correct services instead of non-existent functions
import { uploadFile } from './fileUpload';
import { 
  downloadFile, 
  getFileDownloadUrl 
} from './fileDownload';
import { deleteFile } from './fileDelete';
import {
  updateFileMetadata,
  replaceFile
} from './fileUpdate';
import { 
  getDocuments, 
  searchDocuments, 
  getDocumentById,
  getDocumentsByFolderId
} from './fileQuery';

// Export all functions
export {
  uploadFile,
  downloadFile,
  getFileDownloadUrl,
  deleteFile,
  updateFileMetadata,
  replaceFile,
  getDocuments,
  searchDocuments,
  getDocumentById,
  getDocumentsByFolderId
};
