
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyDocument } from '@/services/document/fileUpload';
import { deleteDocument } from '@/services/document';
import { DocumentType } from '@/types/property';

/**
 * Hook for document upload and delete mutations
 */
export const useDocumentMutations = (
  propertyId?: string,
  onUploadSuccess?: () => void
) => {
  const queryClient = useQueryClient();
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ 
      file,
      name,
      description,
      documentType,
      additionalMetadata = {}
    }: {
      file: File;
      name: string;
      description: string;
      documentType: DocumentType;
      additionalMetadata?: Record<string, any>;
    }) => {
      if (!propertyId) throw new Error('Property ID is required');
      
      return uploadPropertyDocument(
        propertyId,
        file,
        documentType,
        name,
        description,
        additionalMetadata
      );
    },
    onSuccess: (success) => {
      if (success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['recentDocuments'] });
        queryClient.invalidateQueries({ queryKey: ['expiringDocuments'] });
        
        // Show success message
        toast({
          title: 'Document uploaded',
          description: 'The document has been uploaded successfully.',
        });
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'There was an error uploading the document.',
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      return deleteDocument(id, filePath);
    },
    onSuccess: (success) => {
      if (success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['documents', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['recentDocuments'] });
        queryClient.invalidateQueries({ queryKey: ['expiringDocuments'] });
        
        // Show success message
        toast({
          title: 'Document deleted',
          description: 'The document has been deleted successfully.',
        });
      }
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'There was an error deleting the document.',
      });
    }
  });
  
  return {
    uploadMutation,
    deleteMutation
  };
};
