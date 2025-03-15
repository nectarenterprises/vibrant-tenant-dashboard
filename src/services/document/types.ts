
import { DocumentTag } from '@/types/property';

export type FolderType = 'lease' | 'utility' | 'compliance' | 'service-charge' | 'other';

export const DOCUMENT_TYPES: Record<FolderType, string> = {
  'lease': 'Lease Agreement',
  'utility': 'Utility Bill',
  'compliance': 'Compliance Document',
  'service-charge': 'Service Charge Statement',
  'other': 'Other Document'
};

// Define a folder structure type for Documents page
export interface DocumentFolder {
  id: string;
  name: string;
  path: string;
  type: FolderType;
}

// Document metadata interface
export interface DocumentMetadata {
  id: string;
  name: string;
  description?: string;
  documentType: FolderType;
  tags?: DocumentTag[];
  uploadDate: string;
  uploadedBy: string;
  isFavorite?: boolean;
  version?: number;
  versionNotes?: string;
  expiryDate?: string;
  notificationPeriod?: number; // in days
  keyDates?: {
    commencement?: string;
    expiry?: string;
    breakOption?: string[];
    rentReview?: string[];
  };
}

// Function to get folder structure for a property
export const getPropertyFolderStructure = (propertyId: string): DocumentFolder[] => {
  return [
    {
      id: 'lease',
      name: DOCUMENT_TYPES['lease'],
      path: `${propertyId}/lease`,
      type: 'lease'
    },
    {
      id: 'utility',
      name: DOCUMENT_TYPES['utility'],
      path: `${propertyId}/utility`,
      type: 'utility' 
    },
    {
      id: 'compliance',
      name: DOCUMENT_TYPES['compliance'],
      path: `${propertyId}/compliance`,
      type: 'compliance'
    },
    {
      id: 'service-charge',
      name: DOCUMENT_TYPES['service-charge'],
      path: `${propertyId}/service-charge`,
      type: 'service-charge'
    },
    {
      id: 'other',
      name: DOCUMENT_TYPES['other'],
      path: `${propertyId}/other`,
      type: 'other'
    }
  ];
};

// Define interface for document search and filter options
export interface DocumentSearchOptions {
  searchQuery?: string;
  documentType?: FolderType;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'date' | 'name' | 'type';
  sortOrder?: 'asc' | 'desc';
  isFavorite?: boolean;
}

// Define interface for document version
export interface DocumentVersion {
  version: number;
  uploadDate: string;
  uploadedBy: string;
  filePath: string;
  notes?: string;
}
