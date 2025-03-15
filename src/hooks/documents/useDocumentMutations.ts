
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyDocument } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { 
  uploadPropertyDocument,
  deleteDocument
} from '@/services/document';
import { FolderType } from '@/services/document/types';

/**
 * Hook for document-related mutations
 */
export const useDocumentMutations = (
  propertyId: string | undefined,
  folderType: FolderType | undefined,
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
        data.documentType,
        data.name || data.file.name,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', propertyId, folderType] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      resetForm();
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    }
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-documents', propertyId, folderType] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      });
    }
  });

  return {
    uploadMutation,
    deleteMutation
  };
};
