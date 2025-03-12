
import { supabase } from '@/integrations/supabase/client';
import { PropertyDocument, DocumentType } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type FolderType = DocumentType;

const DOCUMENT_TYPES: Record<DocumentType, string> = {
  'lease': 'Lease Documents',
  'utility': 'Utilities Invoices',
  'compliance': 'Compliance Documents',
  'service-charge': 'Service Charge Info',
  'other': 'Other Documents'
};

export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  documentType: FolderType,
  name?: string,
  description?: string
): Promise<PropertyDocument | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "User not authenticated",
      });
      return null;
    }

    // Create a path with folder structure: property_id/document_type/filename
    const filePath = `${propertyId}/${documentType}/${file.name}`;
    const fileName = name || file.name;

    // Upload the file to Supabase Storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('property_documents')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: uploadError.message,
      });
      return null;
    }

    // Save document metadata to the database
    const { data: docData, error: dbError } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        user_id: user.id,
        name: fileName,
        description: description || '',
        file_path: filePath,
        document_type: documentType
      })
      .select()
      .single();

    if (dbError) {
      toast({
        variant: "destructive",
        title: "Document metadata error",
        description: dbError.message,
      });
      return null;
    }

    // Transform to frontend model
    const document: PropertyDocument = {
      id: docData.id,
      propertyId: docData.property_id,
      name: docData.name,
      description: docData.description,
      filePath: docData.file_path,
      documentType: docData.document_type as DocumentType,
      uploadDate: docData.upload_date
    };

    toast({
      title: "Document uploaded",
      description: `${fileName} has been uploaded successfully.`,
    });

    return document;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: error.message || "An error occurred during upload",
    });
    return null;
  }
};

export const getPropertyDocuments = async (
  propertyId: string, 
  documentType?: FolderType
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

export const downloadDocument = async (filePath: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('property_documents')
      .download(filePath);
      
    if (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message,
      });
      return;
    }
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'document';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your document is being downloaded.",
    });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Download failed",
      description: error.message || "An error occurred during download",
    });
  }
};

export const deleteDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('property_documents')
      .remove([filePath]);
      
    if (storageError) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: storageError.message,
      });
      return false;
    }
    
    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', documentId);
      
    if (dbError) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: dbError.message,
      });
      return false;
    }
    
    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Delete failed",
      description: error.message || "An error occurred while deleting the document",
    });
    return false;
  }
};

export const getDocumentPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('property_documents')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

export const getPropertyFolderStructure = (propertyId: string) => {
  return Object.entries(DOCUMENT_TYPES).map(([key, label]) => ({
    id: key,
    name: label,
    path: `${propertyId}/${key}`,
    type: key as FolderType
  }));
};
