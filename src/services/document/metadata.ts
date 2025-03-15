
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { FolderType, DocumentVersion } from './types';

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

    // Transform to frontend model
    const document: PropertyDocument = {
      id: data.id,
      propertyId: data.property_id,
      name: data.name,
      description: data.description,
      filePath: data.file_path,
      documentType: data.document_type as DocumentType,
      uploadDate: data.upload_date,
      tags: data.tags ? JSON.parse(data.tags) : undefined,
      isFavorite: data.is_favorite || false,
      version: data.version || 1,
      expiryDate: data.expiry_date,
      keyDates: data.key_dates ? JSON.parse(data.key_dates) : undefined,
      notificationPeriod: data.notification_period
    };

    return document;
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
 * Fetches document metadata from the database
 */
export const fetchDocumentMetadata = async (
  propertyId: string, 
  documentType?: DocumentType,
  searchOptions?: {
    searchQuery?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    isFavorite?: boolean;
    sortBy?: 'date' | 'name' | 'type';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<PropertyDocument[]> => {
  try {
    let query = supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId);
    
    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    // Apply search and filter options
    if (searchOptions) {
      if (searchOptions.searchQuery) {
        query = query.or(`name.ilike.%${searchOptions.searchQuery}%,description.ilike.%${searchOptions.searchQuery}%`);
      }

      if (searchOptions.tags && searchOptions.tags.length > 0) {
        // Note: This is a simplified approach for tag filtering
        for (const tag of searchOptions.tags) {
          query = query.filter('tags', 'cs', tag);
        }
      }

      if (searchOptions.startDate) {
        query = query.gte('upload_date', searchOptions.startDate.toISOString());
      }

      if (searchOptions.endDate) {
        query = query.lte('upload_date', searchOptions.endDate.toISOString());
      }

      if (searchOptions.isFavorite !== undefined) {
        query = query.eq('is_favorite', searchOptions.isFavorite);
      }
    }
    
    // Apply sorting
    const sortField = searchOptions?.sortBy === 'date' ? 'upload_date' : 
                      searchOptions?.sortBy === 'name' ? 'name' : 
                      searchOptions?.sortBy === 'type' ? 'document_type' : 
                      'upload_date';
    const sortDirection = searchOptions?.sortOrder || 'desc';
    
    const { data, error } = await query.order(sortField, { ascending: sortDirection === 'asc' });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch documents",
        description: error.message,
      });
      return [];
    }
    
    // Transform to frontend model
    return data.map(doc => ({
      id: doc.id,
      propertyId: doc.property_id,
      name: doc.name,
      description: doc.description,
      filePath: doc.file_path,
      documentType: doc.document_type as DocumentType,
      uploadDate: doc.upload_date,
      tags: doc.tags ? JSON.parse(doc.tags) : undefined,
      isFavorite: doc.is_favorite || false,
      version: doc.version || 1,
      expiryDate: doc.expiry_date,
      keyDates: doc.key_dates ? JSON.parse(doc.key_dates) : undefined,
      notificationPeriod: doc.notification_period
    }));
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch documents",
      description: error.message || "An error occurred while fetching documents",
    });
    return [];
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

/**
 * Adds a new version of a document
 */
export const addDocumentVersion = async (
  documentId: string, 
  newFilePath: string,
  notes?: string
): Promise<boolean> => {
  try {
    // Get current document to access its version
    const { data: currentDoc, error: fetchError } = await supabase
      .from('property_documents')
      .select('version, previous_versions, file_path')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: fetchError.message,
      });
      return false;
    }
    
    // Calculate new version number
    const newVersion = (currentDoc.version || 1) + 1;
    
    // Prepare previous version entry
    const previousVersion: DocumentVersion = {
      version: currentDoc.version || 1,
      uploadDate: new Date().toISOString(),
      uploadedBy: (await supabase.auth.getUser()).data.user?.id || 'unknown',
      filePath: currentDoc.file_path,
      notes: notes
    };
    
    // Update previous versions array
    const previousVersions = currentDoc.previous_versions ? 
      [...JSON.parse(currentDoc.previous_versions), previousVersion] : 
      [previousVersion];
    
    // Update document with new version info
    const { error: updateError } = await supabase
      .from('property_documents')
      .update({
        file_path: newFilePath,
        version: newVersion,
        previous_versions: JSON.stringify(previousVersions),
        version_notes: notes || '',
        upload_date: new Date().toISOString()
      })
      .eq('id', documentId);
      
    if (updateError) {
      toast({
        variant: "destructive",
        title: "Version update failed",
        description: updateError.message,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Version update failed",
      description: error.message || "An error occurred while updating document version",
    });
    return false;
  }
};

/**
 * Fetches document versions
 */
export const getDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .select('version, previous_versions, file_path, upload_date, user_id, version_notes')
      .eq('id', documentId)
      .single();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: error.message,
      });
      return [];
    }
    
    // Current version
    const currentVersion: DocumentVersion = {
      version: data.version || 1,
      uploadDate: data.upload_date,
      uploadedBy: data.user_id,
      filePath: data.file_path,
      notes: data.version_notes
    };
    
    // Previous versions
    const previousVersions: DocumentVersion[] = data.previous_versions ? 
      JSON.parse(data.previous_versions) : [];
    
    // Return all versions with current one first
    return [currentVersion, ...previousVersions];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Fetch failed",
      description: error.message || "An error occurred while fetching document versions",
    });
    return [];
  }
};

/**
 * Fetches recently accessed documents
 */
export const fetchRecentDocuments = async (limit: number = 5): Promise<PropertyDocument[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false })
      .limit(limit);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch recent documents",
        description: error.message,
      });
      return [];
    }
    
    return data.map(doc => ({
      id: doc.id,
      propertyId: doc.property_id,
      name: doc.name,
      description: doc.description,
      filePath: doc.file_path,
      documentType: doc.document_type as DocumentType,
      uploadDate: doc.upload_date,
      tags: doc.tags ? JSON.parse(doc.tags) : undefined,
      isFavorite: doc.is_favorite || false,
      version: doc.version || 1,
      expiryDate: doc.expiry_date,
      keyDates: doc.key_dates ? JSON.parse(doc.key_dates) : undefined,
      notificationPeriod: doc.notification_period
    }));
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch recent documents",
      description: error.message || "An error occurred while fetching recent documents",
    });
    return [];
  }
};

/**
 * Updates last accessed timestamp for a document
 */
export const updateDocumentAccessTimestamp = async (documentId: string): Promise<void> => {
  try {
    await supabase
      .from('property_documents')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', documentId);
  } catch (error) {
    console.error('Error updating document access timestamp:', error);
  }
};

/**
 * Fetch documents with upcoming expirations
 */
export const fetchExpiringDocuments = async (daysThreshold: number = 90): Promise<PropertyDocument[]> => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .lt('expiry_date', thresholdDate.toISOString())
      .gt('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch expiring documents",
        description: error.message,
      });
      return [];
    }
    
    return data.map(doc => ({
      id: doc.id,
      propertyId: doc.property_id,
      name: doc.name,
      description: doc.description,
      filePath: doc.file_path,
      documentType: doc.document_type as DocumentType,
      uploadDate: doc.upload_date,
      tags: doc.tags ? JSON.parse(doc.tags) : undefined,
      isFavorite: doc.is_favorite || false,
      version: doc.version || 1,
      expiryDate: doc.expiry_date,
      keyDates: doc.key_dates ? JSON.parse(doc.key_dates) : undefined,
      notificationPeriod: doc.notification_period
    }));
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to fetch expiring documents",
      description: error.message || "An error occurred while fetching expiring documents",
    });
    return [];
  }
};
