
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';
import { UtilityBill, ExtractedUtilityData, UtilityType } from '@/types/utility';

export const useUtilityBillSave = (propertyId: string, queryClient: QueryClient) => {
  const saveUtilityBill = async (verifiedData: ExtractedUtilityData, documentId: string): Promise<UtilityBill> => {
    try {
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
        utilityType: billData.utility_type as UtilityType,
        billDate: billData.bill_date,
        periodStart: billData.period_start,
        periodEnd: billData.period_end,
        totalAmount: billData.total_amount,
        usageQuantity: billData.usage_quantity,
        usageUnit: billData.usage_unit,
        meterReference: billData.meter_reference,
        rateInformation: billData.rate_information as UtilityBill['rateInformation'],
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
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "There was an error saving the utility bill data.",
      });
      throw error;
    }
  };
  
  return {
    saveUtilityBill
  };
};
