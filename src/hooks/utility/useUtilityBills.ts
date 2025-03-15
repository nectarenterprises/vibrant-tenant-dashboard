
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UtilityBill, UtilityType } from '@/types/utility';

export const useUtilityBills = (propertyId: string, utilityType?: UtilityType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUtilityBills = async (): Promise<UtilityBill[]> => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('utility_bills')
        .select('*')
        .eq('property_id', propertyId)
        .order('bill_date', { ascending: false });
      
      if (utilityType) {
        query = query.eq('utility_type', utilityType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the database response to our frontend model
      const bills: UtilityBill[] = data.map(bill => ({
        id: bill.id,
        propertyId: bill.property_id,
        userId: bill.user_id,
        utilityType: bill.utility_type as UtilityType,
        billDate: bill.bill_date,
        periodStart: bill.period_start,
        periodEnd: bill.period_end,
        totalAmount: bill.total_amount,
        usageQuantity: bill.usage_quantity,
        usageUnit: bill.usage_unit,
        meterReference: bill.meter_reference,
        rateInformation: bill.rate_information as UtilityBill['rateInformation'],
        notes: bill.notes,
        createdAt: bill.created_at,
        updatedAt: bill.updated_at
      }));
      
      return bills;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const { data: bills = [], ...queryResult } = useQuery({
    queryKey: ['utilityBills', propertyId, utilityType],
    queryFn: fetchUtilityBills
  });

  return {
    bills,
    isLoading: queryResult.isLoading || isLoading,
    error: queryResult.error || error,
    ...queryResult
  };
};
