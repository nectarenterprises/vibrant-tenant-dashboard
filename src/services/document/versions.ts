
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DocumentVersion } from './types';

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
      [...JSON.parse(currentDoc.previous_versions as string), previousVersion] : 
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
      notes: data.version_notes || undefined
    };
    
    // Previous versions
    const previousVersions: DocumentVersion[] = data.previous_versions ? 
      JSON.parse(data.previous_versions as string) : [];
    
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
