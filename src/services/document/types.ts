
export type FolderType = 'lease' | 'utility' | 'compliance' | 'service-charge' | 'other';

export const DOCUMENT_TYPES: Record<FolderType, string> = {
  'lease': 'Lease Agreement',
  'utility': 'Utility Bill',
  'compliance': 'Compliance Document',
  'service-charge': 'Service Charge Statement',
  'other': 'Other Document'
};
