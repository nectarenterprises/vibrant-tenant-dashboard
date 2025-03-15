
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDocument, DocumentType } from '@/types/property';
import { transformToPropertyDocument } from './types';

/**
 * Upload a file to Supabase storage
 * @param file The file to upload
 * @param path Path to storage folder
 * @returns Upload result with data or error
 */
export const uploadFile = async (file: File, path: string = 'documents') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return { data, filePath };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload document for a property with metadata
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  metadata: {
    name: string;
    description?: string;
    documentType: DocumentType;
    tags?: string[];
    expiryDate?: string;
    keyDates?: {
      commencement?: string;
      expiry?: string;
      breakOption?: string[];
      rentReview?: string[];
    };
    notificationPeriod?: number;
  }
) => {
  try {
    // Upload file to storage
    const { filePath } = await uploadFile(file);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Save metadata to database
    const documentData = {
      property_id: propertyId,
      name: metadata.name,
      description: metadata.description || '',
      file_path: filePath,
      document_type: metadata.documentType,
      upload_date: new Date().toISOString(),
      user_id: user.id,
      tags: metadata.tags || [],
      is_favorite: false,
      version: 1,
      expiry_date: metadata.expiryDate,
      key_dates: metadata.keyDates || {},
      notification_period: metadata.notificationPeriod || 0
    };
    
    const { data, error } = await supabase
      .from('property_documents')
      .insert(documentData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return transformToPropertyDocument(data);
  } catch (error) {
    console.error('Error uploading property document:', error);
    throw error;
  }
};

/**
 * Upload a document to a property
 * @param propertyId The property ID to associate with the document
 * @param file The file to upload
 * @param name Name for the document
 * @param documentType Type of document
 * @param description Optional description
 * @param additionalMetadata Optional additional metadata
 * @returns The uploaded document metadata
 */
export const uploadDocument = async (
  propertyId: string,
  file: File,
  name: string,
  documentType: string,
  description?: string,
  additionalMetadata?: any
) => {
  try {
    // Create a path for the file
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `properties/${propertyId}/${Date.now()}_${file.name}`;
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Create document metadata in the database
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        name: name,
        description: description,
        file_path: filePath,
        document_type: documentType,
        upload_date: new Date().toISOString(),
        version: 1,
        ...additionalMetadata
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};
