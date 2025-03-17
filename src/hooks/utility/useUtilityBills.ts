
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UtilityBill, UtilityType } from '@/types/utility';

type UtilityFilterType = UtilityType | 'all';

export const useUtilityBills = (propertyId: string) => {
  const [selectedUtilityType, setSelectedUtilityType] = useState<UtilityFilterType>('all');

  const fetchUtilityBills = async (): Promise<UtilityBill[]> => {
    try {
      if (!propertyId || propertyId === 'all') {
        return [];
      }
      
      let query = supabase
        .from('utility_bills')
        .select('*')
        .eq('property_id', propertyId)
        .order('bill_date', { ascending: false });
      
      if (selectedUtilityType !== 'all') {
        query = query.eq('utility_type', selectedUtilityType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
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
      console.error('Error fetching utility bills:', err);
      return [];
    }
  };

  const { data: bills = [], ...queryResult } = useQuery({
    queryKey: ['utilityBills', propertyId, selectedUtilityType],
    queryFn: fetchUtilityBills
  });

  const getUtilityUsageData = (utilityType: UtilityType) => {
    return bills
      .filter(bill => bill.utilityType === utilityType)
      .map(bill => ({
        period: `${new Date(bill.periodStart).toLocaleDateString('default', { month: 'short' })} - ${new Date(bill.periodEnd).toLocaleDateString('default', { month: 'short' })}`,
        usage: bill.usageQuantity || 0,
        cost: bill.totalAmount
      }))
      .slice(0, 6)
      .reverse();
  };

  const getUtilityCostData = () => {
    if (bills.length === 0) return [];

    const costMap = new Map();
    
    bills.forEach(bill => {
      const month = new Date(bill.billDate).toLocaleDateString('default', { month: 'short', year: 'numeric' });
      
      if (!costMap.has(month)) {
        costMap.set(month, {
          month,
          electricity: 0,
          gas: 0,
          water: 0,
          other: 0
        });
      }
      
      const entry = costMap.get(month);
      entry[bill.utilityType] += bill.totalAmount;
    });
    
    return Array.from(costMap.values())
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6);
  };

  const detectAnomalies = () => {
    if (bills.length === 0) return [];

    const anomalies = [];
    const utilityTypes: UtilityType[] = ['electricity', 'gas', 'water'];
    
    for (const type of utilityTypes) {
      const typeData = bills
        .filter(bill => bill.utilityType === type)
        .sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime());
      
      if (typeData.length >= 2) {
        const latest = typeData[typeData.length - 1];
        const previous = typeData[typeData.length - 2];
        
        if (latest.totalAmount > previous.totalAmount * 1.3) {
          anomalies.push({
            id: latest.id,
            utilityBillId: latest.id,
            anomalyType: 'cost_increase',
            severity: 'medium',
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} bill increased by ${Math.round((latest.totalAmount / previous.totalAmount - 1) * 100)}%`,
            detectedAt: new Date().toISOString()
          });
        }
        
        if (latest.usageQuantity && previous.usageQuantity && latest.usageQuantity > previous.usageQuantity * 1.3) {
          anomalies.push({
            id: latest.id + '_usage',
            utilityBillId: latest.id,
            anomalyType: 'usage_increase',
            severity: 'high',
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} usage increased by ${Math.round((latest.usageQuantity / previous.usageQuantity - 1) * 100)}%`,
            detectedAt: new Date().toISOString()
          });
        }
      }
    }
    
    return anomalies;
  };

  const handleSetSelectedUtilityType = (value: string) => {
    setSelectedUtilityType(value as UtilityFilterType);
  };

  return {
    bills,
    isLoadingBills: queryResult.isLoading,
    selectedUtilityType,
    setSelectedUtilityType: handleSetSelectedUtilityType,
    getUtilityUsageData,
    getUtilityCostData,
    detectAnomalies,
    ...queryResult
  };
};
