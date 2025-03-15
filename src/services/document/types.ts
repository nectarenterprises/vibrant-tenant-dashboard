
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

// Define a type for the property_documents table response
export type PropertyDocumentResponse = {
  id: string;
  property_id: string;
  user_id: string;
  name: string;
  description: string | null;
  file_path: string;
  document_type: string;
  upload_date: string;
  tags: string | null;
  is_favorite: boolean | null;
  version: number;
  expiry_date: string | null;
  key_dates: string | null;
  notification_period: number | null;
  previous_versions: string | null;
  version_notes: string | null;
  last_accessed: string | null;
};

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

// Transform database response to frontend PropertyDocument model
export const transformToPropertyDocument = (doc: PropertyDocumentResponse) => ({
  id: doc.id,
  propertyId: doc.property_id,
  name: doc.name,
  description: doc.description,
  filePath: doc.file_path,
  documentType: doc.document_type as FolderType,
  uploadDate: doc.upload_date,
  tags: doc.tags ? JSON.parse(doc.tags as string) : undefined,
  isFavorite: doc.is_favorite || false,
  version: doc.version || 1,
  expiryDate: doc.expiry_date,
  keyDates: doc.key_dates ? JSON.parse(doc.key_dates as string) : undefined,
  notificationPeriod: doc.notification_period
});
