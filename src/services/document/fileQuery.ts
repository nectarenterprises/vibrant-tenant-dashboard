import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType } from '@/types/property';

/**
 * Get all documents
 * @returns Array of property documents
 */
export const getDocuments = async (): Promise<PropertyDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert from database format to application format
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

/**
 * Search documents by name or description
 * @param query Search query
 * @returns Array of property documents
 */
export const searchDocuments = async (query: string): Promise<PropertyDocument[]> => {
  if (!query) return getDocuments();
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('upload_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
};

/**
 * Get a document by ID
 * @param id ID of the document to get
 * @returns Property document or null if not found
 */
export const getDocumentById = async (id: string): Promise<PropertyDocument | null> => {
  if (!id) return null;
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      propertyId: data.property_id,
      name: data.name,
      description: data.description,
      filePath: data.file_path,
      documentType: data.document_type as DocumentType,
      uploadDate: data.upload_date,
      version: data.version || 1,
      expiryDate: data.expiry_date,
      isFavorite: data.is_favorite || false,
      lastAccessed: data.last_accessed,
      versionNotes: data.version_notes
    };
    
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    return null;
  }
};

/**
 * Get documents by folder ID (document type)
 * @param folderId ID of the folder to get documents for
 * @returns Array of property documents
 */
export const getDocumentsByFolderId = async (folderId: string): Promise<PropertyDocument[]> => {
  if (!folderId) return [];
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('document_type', folderId)
      .order('upload_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error fetching documents by folder ID:', error);
    return [];
  }
};

/**
 * Get recent documents
 * @param propertyId ID of the property to get recent documents for
 * @param limit Number of documents to get
 * @returns Array of property documents
 */
export const getRecentDocuments = async (propertyId: string, limit: number): Promise<PropertyDocument[]> => {
  if (!propertyId) return [];
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('last_accessed', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return [];
  }
};

/**
 * Get expiring documents
 * @param propertyId ID of the property to get expiring documents for
 * @param days Number of days to look ahead
 * @returns Array of property documents
 */
export const getExpiringDocuments = async (propertyId: string, days: number): Promise<PropertyDocument[]> => {
  if (!propertyId) return [];
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .lte('expiry_date', expiryDate.toISOString())
      .order('expiry_date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return [];
  }
};

/**
 * Get all documents for a property
 * @param propertyId ID of the property to get documents for
 * @returns Array of property documents
 */
export const getPropertyDocuments = async (propertyId: string): Promise<PropertyDocument[]> => {
  if (!propertyId) return [];
  
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('upload_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert from database format to application format
    return data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      name: item.name,
      description: item.description,
      filePath: item.file_path,
      documentType: item.document_type as DocumentType,
      uploadDate: item.upload_date,
      version: item.version || 1,
      expiryDate: item.expiry_date,
      isFavorite: item.is_favorite || false,
      lastAccessed: item.last_accessed,
      versionNotes: item.version_notes
    }));
    
  } catch (error) {
    console.error('Error fetching property documents:', error);
    return [];
  }
};
