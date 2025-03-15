
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
 * Export for compatibility
 */
export { uploadPropertyDocument as uploadDocument };
