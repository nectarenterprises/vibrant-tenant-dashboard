
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
