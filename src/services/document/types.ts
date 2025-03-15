
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';

export type FolderType = DocumentType;

export interface DocumentVersion {
  id: string;
  version: number;
  uploadDate: string;
  filePath: string;
  versionNotes?: string;
  uploadedBy?: string;
  notes?: string; // Added notes property to match usage in components
}

export interface DocumentSearchOptions {
  searchQuery?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  isFavorite?: boolean;
  sortBy?: 'date' | 'name' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentFolder {
  id: string;
  name: string;
  type: FolderType;
  icon: string;
  description?: string;
  propertyId?: string; // Added propertyId to match usage in folders.ts
}

// Update DocumentType values in the record to match the types in PropertyDocument
export const DOCUMENT_TYPES: Record<FolderType, string> = {
  'lease': 'Lease Documents',
  'utility': 'Utility Bills',
  'compliance': 'Compliance Documents',
  'service-charge': 'Service Charge Documents',
  'photo': 'Property Photos',
  'other': 'Other Documents'
};

// Adding PropertyDocumentResponse type alias for the basic.ts file
export type PropertyDocumentResponse = any;

/**
 * Safely transforms a database record to PropertyDocument
 */
export const transformToPropertyDocument = (record: any): PropertyDocument => {
  try {
    return {
      id: record.id || '',
      name: record.name || 'Unnamed Document',
      description: record.description || '',
      filePath: record.file_path || '',
      documentType: record.document_type || 'other',
      uploadDate: record.upload_date || new Date().toISOString(),
      propertyId: record.property_id || '', // Changed to propertyId to match PropertyDocument type
      tags: Array.isArray(record.tags) ? record.tags : [],
      isFavorite: record.is_favorite || false,
      version: record.version || 1,
      expiryDate: record.expiry_date || undefined,
      keyDates: record.key_dates || {},
      lastAccessed: record.last_accessed || undefined,
      notificationPeriod: record.notification_period || 0,
      versionNotes: record.version_notes || ''
    };
  } catch (error) {
    console.error('Error transforming document record:', error);
    // Return a minimal valid document in case of errors
    return {
      id: record.id || 'error-id',
      name: 'Error Loading Document',
      description: 'There was an error loading this document.',
      filePath: '',
      documentType: 'other',
      uploadDate: new Date().toISOString(),
      propertyId: record.property_id || '', // Changed to propertyId to match PropertyDocument type
      tags: [],
      isFavorite: false,
      version: 1
    };
  }
};

/**
 * Gets all document folders
 */
export const getDocumentFolders = (): DocumentFolder[] => {
  return [
    {
      id: 'lease',
      name: 'Lease Documents',
      type: 'lease',
      icon: 'file-text',
      description: 'Lease agreements and related documents'
    },
    {
      id: 'utility',
      name: 'Utility Bills',
      type: 'utility',
      icon: 'zap',
      description: 'Electricity, gas, water and other utility bills'
    },
    {
      id: 'compliance',
      name: 'Compliance Documents',
      type: 'compliance',
      icon: 'shield',
      description: 'Safety certificates and regulatory documents'
    },
    {
      id: 'service-charge',
      name: 'Service Charge',
      type: 'service-charge',
      icon: 'receipt',
      description: 'Service charge budgets and statements'
    },
    {
      id: 'photo',
      name: 'Property Photos',
      type: 'photo',
      icon: 'image',
      description: 'Photos of the property'
    },
    {
      id: 'other',
      name: 'Other Documents',
      type: 'other',
      icon: 'folder',
      description: 'Miscellaneous documents'
    }
  ];
};

export const getFolderTypeMap = (): Record<string, string> => {
  return DOCUMENT_TYPES;
};
