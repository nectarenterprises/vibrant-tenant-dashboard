
import { FolderType, DOCUMENT_TYPES } from './types';

/**
 * Gets the folder structure for a property
 */
export const getPropertyFolderStructure = (propertyId: string) => {
  return Object.entries(DOCUMENT_TYPES).map(([key, label]) => ({
    id: key,
    name: label,
    path: `${propertyId}/${key}`,
    type: key as FolderType
  }));
};

/**
 * Creates a file path for a document
 */
export const createDocumentPath = (
  propertyId: string,
  documentType: FolderType,
  fileName: string
): string => {
  return `${propertyId}/${documentType}/${fileName}`;
};
