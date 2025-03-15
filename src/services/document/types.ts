import { DocumentTag } from '@/types/property';

export type FolderType = 'lease' | 'utility' | 'compliance' | 'service-charge' | 'photo' | 'other';

export const DOCUMENT_TYPES: Record<FolderType, string> = {
  lease: 'Lease Documents',
  utility: 'Utility Documents',
  compliance: 'Compliance Documents',
  'service-charge': 'Service Charge Documents',
  photo: 'Property Photos',
  other: 'Other Documents'
};

// Define a folder structure type for Documents page
export interface DocumentFolder {
  id: string;
  name: string;
  path?: string;
  type: FolderType;
  propertyId: string;
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
      type: 'lease',
      propertyId
    },
    {
      id: 'utility',
      name: DOCUMENT_TYPES['utility'],
      path: `${propertyId}/utility`,
      type: 'utility',
      propertyId
    },
    {
      id: 'compliance',
      name: DOCUMENT_TYPES['compliance'],
      path: `${propertyId}/compliance`,
      type: 'compliance',
      propertyId
    },
    {
      id: 'service-charge',
      name: DOCUMENT_TYPES['service-charge'],
      path: `${propertyId}/service-charge`,
      type: 'service-charge',
      propertyId
    },
    {
      id: 'photo',
      name: DOCUMENT_TYPES['photo'],
      path: `${propertyId}/photo`,
      type: 'photo',
      propertyId
    },
    {
      id: 'other',
      name: DOCUMENT_TYPES['other'],
      path: `${propertyId}/other`,
      type: 'other',
      propertyId
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
