
import { supabase } from '@/integrations/supabase/client';
import { ProcessingResult } from '@/types/utility';
import { toast } from '@/components/ui/use-toast';

export const useUtilityBillExtraction = () => {
  const processDocument = async (documentId: string, propertyId: string, documentType = 'utility'): Promise<ProcessingResult> => {
    try {
      console.log('Processing document:', documentId, 'for property:', propertyId, 'of type:', documentType);
      
      // Call the processing edge function
      const { data: processingData, error: processingError } = await supabase.functions
        .invoke('process-utility-bill', {
          body: {
            documentId,
            propertyId,
            documentType,
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
      if (processingError) {
        console.error('Edge function error:', processingError);
        throw new Error('Error processing document: ' + processingError.message);
      }
      
      if (!processingData) {
        console.error('No data returned from edge function');
        throw new Error('No data returned from document processing');
      }
      
      // Verify that the data has the expected format
      if (typeof processingData !== 'object' || processingData === null) {
        console.error('Invalid data format returned from edge function:', processingData);
        throw new Error('Invalid response format from document processing');
      }
      
      console.log('Processing result:', processingData);
      
      // Return result from the edge function
      const result: ProcessingResult = {
        extractedData: processingData.extractedData,
        confidenceScores: processingData.confidenceScores,
        documentId,
        fallback: processingData.fallback || false
      };
      
      return result;
    } catch (error) {
      console.error('Error in processDocument:', error);
      
      // Improved error handling for JSON parse errors
      let errorMessage = 'Failed to process document';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Special handling for JSON parse errors
        if (errorMessage.includes('JSON')) {
          errorMessage = 'Invalid response from document processing service. Please try again.';
          
          // Show toast for JSON errors
          toast({
            variant: "destructive",
            title: "Document Processing Failed",
            description: errorMessage
          });
        }
      }
      
      throw new Error(errorMessage);
    }
  };
  
  return {
    processDocument
  };
};
