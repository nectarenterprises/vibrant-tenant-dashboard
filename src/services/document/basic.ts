
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { FolderType, PropertyDocumentResponse, transformToPropertyDocument } from './types';

/**
 * Saves document metadata to the database
 */
export const saveDocumentMetadata = async (
  propertyId: string,
  fileName: string,
  filePath: string,
  documentType: FolderType,
  description?: string,
  tags?: DocumentTag[],
  expiryDate?: string,
  keyDates?: PropertyDocument['keyDates'],
  notificationPeriod?: number,
  version: number = 1,
  versionNotes?: string
): Promise<PropertyDocument | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to upload documents",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        user_id: user.id,
        name: fileName,
        description: description || '',
        file_path: filePath,
        document_type: documentType,
        tags: tags ? JSON.stringify(tags) : null,
        expiry_date: expiryDate || null,
        key_dates: keyDates ? JSON.stringify(keyDates) : null,
        notification_period: notificationPeriod || null,
        version: version,
        version_notes: versionNotes || '',
        is_favorite: false
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Document metadata error",
        description: error.message,
      });
      return null;
    }

    return transformToPropertyDocument(data as PropertyDocumentResponse);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Metadata error",
      description: error.message || "An error occurred while saving document metadata",
    });
    return null;
  }
};

/**
 * Updates document metadata
 */
export const updateDocumentMetadata = async (
  documentId: string,
  updates: {
    name?: string;
    description?: string;
    tags?: DocumentTag[];
    isFavorite?: boolean;
    expiryDate?: string;
    keyDates?: PropertyDocument['keyDates'];
    notificationPeriod?: number;
  }
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.tags) updateData.tags = JSON.stringify(updates.tags);
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
    if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate;
    if (updates.keyDates) updateData.key_dates = JSON.stringify(updates.keyDates);
    if (updates.notificationPeriod !== undefined) updateData.notification_period = updates.notificationPeriod;
    
    const { error } = await supabase
      .from('property_documents')
      .update(updateData)
      .eq('id', documentId);
      
    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while updating the document metadata",
      });
    return false;
  }
};

/**
 * Deletes document metadata from the database
 */
export const deleteDocumentMetadata = async (documentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
      
    if (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Delete failed",
      description: error.message || "An error occurred while deleting the document metadata",
    });
    return false;
  }
};

/**
 * Toggles document favorite status
 */
export const toggleDocumentFavorite = async (
  documentId: string,
  isFavorite: boolean
): Promise<boolean> => {
  return updateDocumentMetadata(documentId, { isFavorite });
};
