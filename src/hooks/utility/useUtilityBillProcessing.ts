
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UtilityBill, 
  UtilityBillUpload, 
  ProcessingResult,
  ExtractedUtilityData
} from '@/types/utility';
import { v4 as uuidv4 } from 'uuid';

export const useUtilityBillProcessing = (propertyId: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'verifying' | 'completed' | 'failed'>('idle');
  const [extractionResult, setExtractionResult] = useState<ProcessingResult | null>(null);
  const queryClient = useQueryClient();

  // Upload utility bill document
  const uploadDocument = async (fileUpload: UtilityBillUpload): Promise<ProcessingResult> => {
    try {
      setProcessingStatus('uploading');
      setUploadProgress(0);
      
      // First, create a unique filename
      const fileExtension = fileUpload.file.name.split('.').pop() || '';
      const filePath = `${propertyId}/utility/${uuidv4()}.${fileExtension}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileUpload.file, {
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });
      
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
      
      // Start processing with AI
      setProcessingStatus('processing');
      
      // Create extraction record
      await supabase
        .from('utility_data_extractions')
        .insert({
          document_id: documentData.id,
          extraction_status: 'pending'
        });
      
      // Call the processing edge function
      const { data: processingData, error: processingError } = await supabase.functions
        .invoke('process-utility-bill', {
          body: {
            documentId: documentData.id,
            propertyId: propertyId,
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
      if (processingError) {
        throw new Error('Error processing document: ' + processingError.message);
      }
      
      console.log('Processing result:', processingData);
      setProcessingStatus('verifying');
      
      const result = {
        extractedData: processingData.extractedData,
        confidenceScores: processingData.confidenceScores,
        documentId: documentData.id
      };
      
      setExtractionResult(result);
      return result;
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      setProcessingStatus('failed');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your document.",
      });
      throw error;
    }
  };
  
  // Save verified utility bill data
  const saveUtilityBill = async (verifiedData: ExtractedUtilityData, documentId: string): Promise<UtilityBill> => {
    try {
      setProcessingStatus('completed');
      
      // Save to utility_bills table
      const { data: billData, error: billError } = await supabase
        .from('utility_bills')
        .insert({
          property_id: propertyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          utility_type: verifiedData.utilityType,
          bill_date: verifiedData.billDate,
          period_start: verifiedData.periodStart,
          period_end: verifiedData.periodEnd,
          total_amount: verifiedData.totalAmount,
          usage_quantity: verifiedData.usageQuantity,
          usage_unit: verifiedData.usageUnit,
          meter_reference: verifiedData.meterReference,
          rate_information: verifiedData.rateInformation
        })
        .select()
        .single();
        
      if (billError || !billData) {
        throw new Error('Error saving utility bill: ' + billError?.message);
      }
      
      // Link document to utility bill
      const { error: linkError } = await supabase
        .from('utility_bill_documents')
        .insert({
          utility_bill_id: billData.id,
          document_id: documentId,
          is_original: true
        });
        
      if (linkError) {
        throw new Error('Error linking document to bill: ' + linkError.message);
      }
      
      // Update extraction record to verified
      const { error: updateError } = await supabase
        .from('utility_data_extractions')
        .update({
          verified: true,
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verified_date: new Date().toISOString()
        })
        .eq('document_id', documentId);
      
      if (updateError) {
        console.error('Error updating extraction record:', updateError);
      }
      
      // Format the response
      const result: UtilityBill = {
        id: billData.id,
        propertyId: billData.property_id,
        userId: billData.user_id,
        utilityType: billData.utility_type,
        billDate: billData.bill_date,
        periodStart: billData.period_start,
        periodEnd: billData.period_end,
        totalAmount: billData.total_amount,
        usageQuantity: billData.usage_quantity,
        usageUnit: billData.usage_unit,
        meterReference: billData.meter_reference,
        rateInformation: billData.rate_information,
        notes: billData.notes,
        createdAt: billData.created_at,
        updatedAt: billData.updated_at
      };
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['utilityBills', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['utilityDocuments', propertyId] });
      
      toast({
        title: "Bill processed successfully",
        description: `Utility bill data has been saved.`,
      });
      
      return result;
    } catch (error) {
      console.error('Error in saveUtilityBill:', error);
      setProcessingStatus('failed');
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "There was an error saving the utility bill data.",
      });
      throw error;
    }
  };
  
  // Create mutations
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      console.log('Upload completed successfully');
    }
  });
  
  const saveMutation = useMutation({
    mutationFn: ({ data, documentId }: { data: ExtractedUtilityData, documentId: string }) => 
      saveUtilityBill(data, documentId),
    onSuccess: () => {
      setProcessingStatus('idle');
      setExtractionResult(null);
    }
  });
  
  // Reset state
  const resetProcessing = () => {
    setProcessingStatus('idle');
    setUploadProgress(0);
    setExtractionResult(null);
  };
  
  return {
    uploadProgress,
    processingStatus,
    extractionResult,
    uploadMutation,
    saveMutation,
    resetProcessing
  };
};
