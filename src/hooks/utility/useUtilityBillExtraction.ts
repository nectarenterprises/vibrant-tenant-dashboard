
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProcessingResult, ExtractedUtilityData, ConfidenceScores } from '@/types/utility';

export const useUtilityBillExtraction = () => {
  const processDocument = async (
    documentId: string, 
    propertyId: string, 
    documentType: string = 'utility'
  ): Promise<ProcessingResult> => {
    try {
      console.log(`Processing ${documentType} document ${documentId} for property ${propertyId}`);
      
      // Get the current user's ID for passing to the edge function
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User authentication required');
      }
      
      // Call the edge function to process the document
      const { data, error } = await supabase.functions.invoke('process-utility-bill', {
        body: {
          documentId,
          propertyId,
          userId: user.id,
          documentType
        }
      });
      
      if (error) {
        console.error('Error processing document:', error);
        throw new Error(`Failed to process document: ${error.message}`);
      }
      
      if (!data?.success) {
        throw new Error('Document processing failed');
      }
      
      // Return the processing result
      return {
        extractedData: data.extractedData,
        confidenceScores: data.confidenceScores,
        documentId,
        fallback: data.fallback || false
      };
    } catch (error) {
      console.error('Error in processDocument:', error);
      
      // Create a default result for fallback
      const defaultData: ExtractedUtilityData = {
        utilityType: 'electricity',
        billDate: new Date().toISOString().split('T')[0],
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        periodEnd: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        usageQuantity: 0,
        usageUnit: 'kWh'
      };
      
      // Create a default confidence scores object with all required properties
      const defaultConfidenceScores: ConfidenceScores = {
        utilityType: 0.5,
        billDate: 0.5,
        periodStart: 0.5,
        periodEnd: 0.5,
        totalAmount: 0.5,
        usageQuantity: 0.5,
        usageUnit: 0.5
      };
      
      toast({
        variant: "destructive",
        title: "Processing error",
        description: error.message || "Failed to process document",
      });
      
      return {
        extractedData: defaultData,
        confidenceScores: defaultConfidenceScores,
        documentId,
        fallback: true
      };
    }
  };
  
  return {
    processDocument
  };
};
