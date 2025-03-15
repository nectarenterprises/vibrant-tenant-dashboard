
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument } from '@/services/document';
import { deleteDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

/**
 * Custom hook for document mutations (upload, delete)
 */
export const useDocumentMutations = (
  propertyId: string | undefined,
  onUploadSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: {
      file: File;
      name: string;
      type: string;
      description?: string;
      additionalMetadata?: any;
    }) => {
      if (!propertyId) throw new Error('Property ID is required');
      
      return uploadDocument(
        propertyId,
        data.file,
        data.name,
        data.type,
        data.description,
        data.additionalMetadata
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      
      toast({
        title: "Upload successful",
        description: "The document has been uploaded successfully."
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: String(error) || "There was an error uploading the document."
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['recent-documents'] });
      
      toast({
        title: "Delete successful",
        description: "The document has been deleted successfully."
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
