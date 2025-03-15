
// Re-export all property-related services for easier importing
export * from './PropertyFetchService';
export * from './PropertyCreateService';
export * from './PropertyImageService';

// Export fetchProperty as an alias to getProperty from PropertyFetchService
import { getProperty } from './PropertyFetchService';
export const fetchProperty = getProperty;
