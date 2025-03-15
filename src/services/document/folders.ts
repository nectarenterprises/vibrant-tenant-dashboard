
import { DocumentFolder, FolderType } from './types';

/**
 * Get property folder structure
 * @param propertyId - The property ID
 * @returns Array of document folders
 */
export const getPropertyFolders = (propertyId: string): DocumentFolder[] => {
  return [
    {
      id: `${propertyId}-lease`,
      name: 'Lease Documents',
      type: 'lease',
      propertyId
    },
    {
      id: `${propertyId}-utility`,
      name: 'Utility Documents',
      type: 'utility',
      propertyId
    },
    {
      id: `${propertyId}-compliance`,
      name: 'Compliance Documents',
      type: 'compliance',
      propertyId
    },
    {
      id: `${propertyId}-service-charge`,
      name: 'Service Charge Documents',
      type: 'service-charge',
      propertyId
    },
    {
      id: `${propertyId}-photo`,
      name: 'Property Photos',
      type: 'photo',
      propertyId
    },
    {
      id: `${propertyId}-other`,
      name: 'Other Documents',
      type: 'other',
      propertyId
    }
  ];
};

/**
 * Get the folder type map
 * @returns Map of folder types to their display names
 */
export const getFolderTypeMap = (): Record<FolderType, string> => {
  return {
    lease: 'Lease Documents',
    utility: 'Utility Documents',
    compliance: 'Compliance Documents',
    'service-charge': 'Service Charge Documents',
    photo: 'Property Photos',
    other: 'Other Documents'
  };
};
