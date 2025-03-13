
import { FolderType, DOCUMENT_TYPES } from './types';

/**
 * Gets the folder structure for a property
 */
export const getPropertyFolderStructure = (propertyId: string) => {
  const folderStructure: Record<FolderType, string> = {
    'lease': `${propertyId}/lease`,
    'utility': `${propertyId}/utility`,
    'compliance': `${propertyId}/compliance`,
    'service-charge': `${propertyId}/service-charge`,
    'other': `${propertyId}/other`
  };
  
  return folderStructure;
};

/**
 * Creates a document path for storage
 */
export const createDocumentPath = (
  propertyId: string,
  documentType: FolderType,
  fileName: string
): string => {
  const timestamp = new Date().getTime();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${propertyId}/${documentType}/${timestamp}_${sanitizedFileName}`;
};

/**
 * Gets document types for the property
 */
export const getDocumentTypes = (): Record<FolderType, string> => {
  return DOCUMENT_TYPES;
};
