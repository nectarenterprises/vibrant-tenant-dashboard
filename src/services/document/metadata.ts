
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';
import { DocumentSearchOptions, DocumentVersion, FolderType } from './types';

// Re-export all functions from separate files
export { saveDocumentMetadata, updateDocumentMetadata, deleteDocumentMetadata, toggleDocumentFavorite } from './basic';
export { fetchDocumentMetadata, fetchRecentDocuments, fetchExpiringDocuments } from './search';
export { addDocumentVersion, getDocumentVersions } from './versions';
export { updateDocumentAccessTimestamp } from './access';
