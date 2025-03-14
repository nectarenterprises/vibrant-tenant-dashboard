
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUtilityBillUpload } from './useUtilityBillUpload';
import { useUtilityBillExtraction } from './useUtilityBillExtraction';
import { useUtilityBillSave } from './useUtilityBillSave';
import { toast } from '@/components/ui/use-toast';
import { 
  UtilityBill, 
  UtilityBillUpload, 
  ProcessingResult,
  ExtractedUtilityData
} from '@/types/utility';
import { DocumentType } from '@/types/property';

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'verifying' | 'completed' | 'failed';

export const useUtilityBillProcessing = (propertyId: string, documentType: DocumentType = 'utility') => {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [extractionResult, setExtractionResult] = useState<ProcessingResult | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const queryClient = useQueryClient();
  
  const { uploadProgress, uploadDocument } = useUtilityBillUpload(propertyId);
  const { processDocument } = useUtilityBillExtraction();
  const { saveUtilityBill } = useUtilityBillSave(propertyId, queryClient);
  
  // Upload and process document
  const handleUploadDocument = async (fileUpload: UtilityBillUpload): Promise<ProcessingResult> => {
    try {
      setProcessingStatus('uploading');
      setProcessingError(null);
      setIsFallbackData(false);
      
      // Upload document and get document ID
      const documentId = await uploadDocument(fileUpload);
      
      // Process document with AI
      setProcessingStatus('processing');
      // Passing the documentType argument to processDocument
      const processingResult = await processDocument(documentId, propertyId, documentType);
      
      setProcessingStatus('verifying');
      setExtractionResult(processingResult);
      
      // Check if fallback data was used
      if (processingResult.fallback) {
        setIsFallbackData(true);
        toast({
          title: "Using simulated data",
          description: `We're using simulated data for this ${documentType} document. Please review all fields carefully.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Document processed",
          description: "Please verify the extracted information below.",
        });
      }
      
      return processingResult;
    } catch (error) {
      console.error('Error in handleUploadDocument:', error);
      setProcessingStatus('failed');
      setProcessingError(error.message || "Failed to process document");
      throw error;
    }
  };
  
  // Create mutations
  const uploadMutation = useMutation({
    mutationFn: handleUploadDocument,
    onSuccess: () => {
      console.log('Upload and processing completed successfully');
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
      setProcessingError(null);
      setIsFallbackData(false);
    }
  });
  
  // Reset state
  const resetProcessing = () => {
    setProcessingStatus('idle');
    setExtractionResult(null);
    setProcessingError(null);
    setIsFallbackData(false);
  };
  
  return {
    uploadProgress,
    processingStatus,
    extractionResult,
    processingError,
    isFallbackData,
    uploadMutation,
    saveMutation,
    resetProcessing
  };
};
