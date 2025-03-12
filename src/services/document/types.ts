
import { DocumentType } from '@/types/property';

// Making sure FolderType is equivalent to DocumentType
export type FolderType = DocumentType;

export const DOCUMENT_TYPES: Record<DocumentType, string> = {
  'lease': 'Lease Documents',
  'utility': 'Utilities Invoices',
  'compliance': 'Compliance Documents',
  'service-charge': 'Service Charge Info',
  'other': 'Other Documents'
};
