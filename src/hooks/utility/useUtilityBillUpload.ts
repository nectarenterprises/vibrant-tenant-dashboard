
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { UtilityBillUpload } from '@/types/utility';

export const useUtilityBillUpload = (propertyId: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadDocument = async (fileUpload: UtilityBillUpload): Promise<string> => {
    try {
      setUploadProgress(0);
      
      // First, create a unique filename
      const fileExtension = fileUpload.file.name.split('.').pop() || '';
      const filePath = `${propertyId}/utility/${uuidv4()}.${fileExtension}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileUpload.file, {
          upsert: true,
          // We need to use the onUploadProgress event handler differently
          // as it's not directly supported in the options
        });
      
      // Manual progress handling through event emitter would be needed
      // but for now we'll simulate progress
      setUploadProgress(50);
      
      if (uploadError) {
        throw new Error('Error uploading document: ' + uploadError.message);
      }
      
      setUploadProgress(100);
      console.log('Document uploaded successfully');
      
      // Save document metadata
      const { data: documentData, error: documentError } = await supabase
        .from('property_documents')
        .insert({
          property_id: propertyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          name: fileUpload.file.name,
          description: `Utility bill uploaded on ${new Date().toLocaleDateString()}`,
          file_path: filePath,
          document_type: 'utility',
          tags: ['utility', fileUpload.utilityType || 'unknown']
        })
        .select()
        .single();
      
      if (documentError || !documentData) {
        throw new Error('Error saving document metadata: ' + documentError?.message);
      }
      
      console.log('Document metadata saved:', documentData);
      
      // Create extraction record
      await supabase
        .from('utility_data_extractions')
        .insert({
          document_id: documentData.id,
          extraction_status: 'pending'
        });
      
      return documentData.id;
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your document.",
      });
      throw error;
    }
  };

  return {
    uploadProgress,
    uploadDocument
  };
};
