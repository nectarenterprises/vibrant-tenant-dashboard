
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
      description: 'Lease agreements and related documents',
      propertyId
    },
    {
      id: `${propertyId}-utility`,
      name: 'Utility Documents',
      type: 'utility',
      icon: 'zap',
      description: 'Electricity, gas, water and other utility bills',
      propertyId
    },
    {
      id: `${propertyId}-compliance`,
      name: 'Compliance Documents',
      type: 'compliance',
      icon: 'shield',
      description: 'Safety certificates and regulatory documents',
      propertyId
    },
    {
      id: `${propertyId}-service-charge`,
      name: 'Service Charge Documents',
      type: 'service-charge',
      icon: 'receipt',
      description: 'Service charge budgets and statements',
      propertyId
    },
    {
      id: `${propertyId}-correspondence`,
      name: 'Correspondence',
      type: 'correspondence',
      icon: 'mail',
      description: 'Communication with tenants and other parties',
      propertyId
    },
    {
      id: `${propertyId}-photo`,
      name: 'Property Photos',
      type: 'photo',
      icon: 'image',
      description: 'Photos of the property',
      propertyId
    },
    {
      id: `${propertyId}-other`,
      name: 'Other Documents',
      type: 'other',
      icon: 'folder',
      description: 'Miscellaneous documents',
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
    correspondence: 'Correspondence',
    photo: 'Property Photos',
    insurance: 'Insurance Documents',
    tax: 'Tax Documents',
    other: 'Other Documents'
  };
};
