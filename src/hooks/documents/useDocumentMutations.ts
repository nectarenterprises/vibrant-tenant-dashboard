import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  uploadPropertyDocument,
  deleteDocument
} from '@/services/document';
import { FolderType } from '@/services/document/types';
import { DocumentType } from '@/types/property';

/**
 * Hook for document-related mutations
 */
export const useDocumentMutations = (
  propertyId: string | undefined,
  resetForm: () => void
) => {
  const queryClient = useQueryClient();

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: { 
      file: File, 
      name: string, 
      description: string, 
      documentType: FolderType 
    }) => {
      if (!data.file || !propertyId) return null;
      
      return uploadPropertyDocument(
        propertyId,
        data.file,
        data.documentType as DocumentType,
        data.name || data.file.name,
        data.description
      );
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', propertyId, variables.documentType] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      resetForm();
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your document."
      });
    }
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents'] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the document."
      });
    }
  });

  return {
    uploadMutation,
    deleteMutation
  };
};
