import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { FolderType } from './types';

/**
 * Saves document metadata to the database
 */
export const saveDocumentMetadata = async (
  propertyId: string,
  fileName: string,
  filePath: string,
  documentType: FolderType,
  description?: string
): Promise<PropertyDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        name: fileName,
        description: description || '',
        file_path: filePath,
        document_type: documentType
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
      uploadDate: data.upload_date
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
  documentType?: DocumentType
): Promise<PropertyDocument[]> => {
  try {
    let query = supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId);
    
    if (documentType) {
      query = query.eq('document_type', documentType);
    }
    
    const { data, error } = await query.order('upload_date', { ascending: false });
    
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
      uploadDate: doc.upload_date
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
