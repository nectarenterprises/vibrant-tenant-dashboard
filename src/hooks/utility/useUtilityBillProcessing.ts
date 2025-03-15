
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUtilityBillUpload } from './useUtilityBillUpload';
import { useUtilityBillExtraction } from './useUtilityBillExtraction';
import { useUtilityBillSave } from './useUtilityBillSave';
import { 
  UtilityBill, 
  UtilityBillUpload, 
  ProcessingResult,
  ExtractedUtilityData
} from '@/types/utility';

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'verifying' | 'completed' | 'failed';

export const useUtilityBillProcessing = (propertyId: string) => {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [extractionResult, setExtractionResult] = useState<ProcessingResult | null>(null);
  const queryClient = useQueryClient();
  
  const { uploadProgress, uploadDocument } = useUtilityBillUpload(propertyId);
  const { processDocument } = useUtilityBillExtraction();
  const { saveUtilityBill } = useUtilityBillSave(propertyId, queryClient);
  
  // Upload and process utility bill document
  const handleUploadDocument = async (fileUpload: UtilityBillUpload): Promise<ProcessingResult> => {
    try {
      setProcessingStatus('uploading');
      
      // Upload document and get document ID
      const documentId = await uploadDocument(fileUpload);
      
      // Process document with AI
      setProcessingStatus('processing');
      const processingResult = await processDocument(documentId, propertyId);
      
      setProcessingStatus('verifying');
      setExtractionResult(processingResult);
      
      return processingResult;
    } catch (error) {
      console.error('Error in handleUploadDocument:', error);
      setProcessingStatus('failed');
      throw error;
    }
  };
  
  // Create mutations
  const uploadMutation = useMutation({
    mutationFn: handleUploadDocument,
    onSuccess: () => {
      console.log('Upload completed successfully');
    }
  });
  
  const saveMutation = useMutation({
    mutationFn: ({ data, documentId }: { data: ExtractedUtilityData, documentId: string }) => {
      setProcessingStatus('completed');
      return saveUtilityBill(data, documentId);
    },
    onSuccess: () => {
      setProcessingStatus('idle');
      setExtractionResult(null);
    }
  });
  
  // Reset state
  const resetProcessing = () => {
    setProcessingStatus('idle');
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
