
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';

export type FolderType = DocumentType;

export interface DocumentVersion {
  id: string;
  version: number;
  uploadDate: string;
  filePath: string;
  versionNotes?: string;
  uploadedBy?: string;
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
}

export const DOCUMENT_TYPES: Record<FolderType, string> = {
  'lease': 'Lease Documents',
  'utility': 'Utility Bills',
  'compliance': 'Compliance Documents',
  'insurance': 'Insurance Documents',
  'tax': 'Tax Documents',
  'service-charge': 'Service Charge Documents',
  'correspondence': 'Correspondence',
  'other': 'Other Documents'
};

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
      property_id: record.property_id || '',
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
      property_id: record.property_id || '',
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
      id: 'insurance',
      name: 'Insurance',
      type: 'insurance',
      icon: 'umbrella',
      description: 'Insurance policies and certificates'
    },
    {
      id: 'tax',
      name: 'Tax Documents',
      type: 'tax',
      icon: 'landmark',
      description: 'Tax forms and payment records'
    },
    {
      id: 'correspondence',
      name: 'Correspondence',
      type: 'correspondence',
      icon: 'mail',
      description: 'Letters and emails related to the property'
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
