
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
      description: 'Store all lease-related documents',
      propertyId
    },
    {
      id: `${propertyId}-utility`,
      name: 'Utility Documents',
      type: 'utility',
      description: 'Store utility bills and related documents',
      propertyId
    },
    {
      id: `${propertyId}-compliance`,
      name: 'Compliance Documents',
      type: 'compliance',
      description: 'Store compliance certificates and related documents',
      propertyId
    },
    {
      id: `${propertyId}-service-charge`,
      name: 'Service Charge Documents',
      type: 'service-charge',
      description: 'Store service charge statements and related documents',
      propertyId
    },
    {
      id: `${propertyId}-photo`,
      name: 'Property Photos',
      type: 'photo',
      description: 'Store photos of the property',
      propertyId
    },
    {
      id: `${propertyId}-other`,
      name: 'Other Documents',
      type: 'other',
      description: 'Store miscellaneous documents',
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
