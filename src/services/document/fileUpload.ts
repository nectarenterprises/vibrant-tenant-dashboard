
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDocument, DocumentType } from '@/types/property';
import { transformToPropertyDocument } from './types';
import { FolderType } from './types';

/**
 * Uploads a document for a property
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  documentType: DocumentType,
  name: string,
  description: string,
  additionalMetadata: Record<string, any> = {}
): Promise<PropertyDocument | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Generate a unique path for the file
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filePath = `${propertyId}/${documentType}/${filename}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Create metadata record in the database
    const { data: documentData, error: insertError } = await supabase
      .from('property_documents')
      .insert({
        name,
        description,
        file_path: filePath,
        document_type: documentType,
        property_id: propertyId,
        user_id: userId,
        ...additionalMetadata
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting document metadata:', insertError);
      throw insertError;
    }

    // Return the document
    return transformToPropertyDocument(documentData);
  } catch (error) {
    console.error('Error in uploadPropertyDocument:', error);
    return null;
  }
};

/**
 * Uploads a new version of an existing document
 */
export const uploadNewDocumentVersion = async (
  existingDocument: PropertyDocument,
  file: File,
  versionNotes: string
): Promise<PropertyDocument | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Generate a unique path for the file
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filePath = `${existingDocument.propertyId}/${existingDocument.documentType}/${filename}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Store the previous version information
    let previousVersions = existingDocument.previousVersions || [];
    previousVersions.push({
      version: existingDocument.version || 1,
      filePath: existingDocument.filePath,
      uploadDate: existingDocument.uploadDate,
      notes: existingDocument.versionNotes
    });

    // Update the document record with the new version
    const { data: updatedDocument, error: updateError } = await supabase
      .from('property_documents')
      .update({
        file_path: filePath,
        version: (existingDocument.version || 1) + 1,
        version_notes: versionNotes,
        previous_versions: previousVersions,
        upload_date: new Date().toISOString()
      })
      .eq('id', existingDocument.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating document version:', updateError);
      throw updateError;
    }

    return transformToPropertyDocument(updatedDocument);
  } catch (error) {
    console.error('Error in uploadNewDocumentVersion:', error);
    return null;
  }
};
