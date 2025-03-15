
import { supabase } from '@/integrations/supabase/client';
import { ProcessingResult } from '@/types/utility';

export const useUtilityBillExtraction = () => {
  const processDocument = async (documentId: string, propertyId: string): Promise<ProcessingResult> => {
    try {
      // Call the processing edge function
      const { data: processingData, error: processingError } = await supabase.functions
        .invoke('process-utility-bill', {
          body: {
            documentId,
            propertyId,
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
      if (processingError) {
        throw new Error('Error processing document: ' + processingError.message);
      }
      
      console.log('Processing result:', processingData);
      
      const result: ProcessingResult = {
        extractedData: processingData.extractedData,
        confidenceScores: processingData.confidenceScores,
        documentId
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
