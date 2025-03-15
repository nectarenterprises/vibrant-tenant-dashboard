
import { supabase } from '@/integrations/supabase/client';
import { ProcessingResult } from '@/types/utility';

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
      
      console.log('Processing result:', processingData);
      
      // Return result from the edge function
      const result: ProcessingResult = {
        extractedData: processingData.extractedData,
        confidenceScores: processingData.confidenceScores,
        documentId,
        fallback: processingData.fallback || false,
        documentType: documentType
      };
      
      return result;
    } catch (error) {
      console.error('Error in processDocument:', error);
      throw error;
    }
  };
  
  return {
    processDocument
  };
};
