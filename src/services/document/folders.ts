
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
      icon: 'file-text',
      description: 'Lease agreements and related documents'
    },
    {
      id: `${propertyId}-utility`,
      name: 'Utility Documents',
      type: 'utility',
      icon: 'zap',
      description: 'Electricity, gas, water and other utility bills'
    },
    {
      id: `${propertyId}-compliance`,
      name: 'Compliance Documents',
      type: 'compliance',
      icon: 'shield',
      description: 'Safety certificates and regulatory documents'
    },
    {
      id: `${propertyId}-service-charge`,
      name: 'Service Charge Documents',
      type: 'service-charge',
      icon: 'receipt',
      description: 'Service charge budgets and statements'
    },
    {
      id: `${propertyId}-photo`,
      name: 'Property Photos',
      type: 'photo',
      icon: 'image',
      description: 'Photos of the property'
    },
    {
      id: `${propertyId}-other`,
      name: 'Other Documents',
      type: 'other',
      icon: 'folder',
      description: 'Miscellaneous documents'
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
