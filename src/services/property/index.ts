
// Re-export all property-related services for easier importing
export * from './PropertyFetchService';
export * from './PropertyCreateService';
export * from './PropertyImageService';

// Export aliases for backward compatibility
import { getProperty, fetchUserProperties } from './PropertyFetchService';
export { getProperty, fetchUserProperties };
export const fetchProperty = getProperty;
