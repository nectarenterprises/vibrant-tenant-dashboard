
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UtilityBill, UtilityType } from '@/types/utility';

export const useUtilityBills = (propertyId?: string) => {
  const [selectedUtilityType, setSelectedUtilityType] = useState<UtilityType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  // Fetch utility bills for a property
  const fetchUtilityBills = async (propertyId?: string): Promise<UtilityBill[]> => {
    if (!propertyId) return [];
    
    let query = supabase
      .from('utility_bills')
      .select('*')
      .eq('property_id', propertyId)
      .order('bill_date', { ascending: false });
    
    // Apply utility type filter if not 'all'
    if (selectedUtilityType !== 'all') {
      query = query.eq('utility_type', selectedUtilityType);
    }
    
    // Apply date range filters if set
    if (dateRange.from) {
      query = query.gte('bill_date', dateRange.from.toISOString().split('T')[0]);
    }
    
    if (dateRange.to) {
      query = query.lte('bill_date', dateRange.to.toISOString().split('T')[0]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching utility bills:', error);
      return [];
    }
    
    return data.map(bill => ({
      id: bill.id,
      propertyId: bill.property_id,
      userId: bill.user_id,
      utilityType: bill.utility_type,
      billDate: bill.bill_date,
      periodStart: bill.period_start,
      periodEnd: bill.period_end,
      totalAmount: bill.total_amount,
      usageQuantity: bill.usage_quantity,
      usageUnit: bill.usage_unit,
      meterReference: bill.meter_reference,
      rateInformation: bill.rate_information,
      notes: bill.notes,
      createdAt: bill.created_at,
      updatedAt: bill.updated_at
    }));
  };

  // Query for utility bills
  const { 
    data: utilityBills = [], 
    isLoading: isLoadingBills,
    error: billsError,
    refetch: refetchBills
  } = useQuery({
    queryKey: ['utilityBills', propertyId, selectedUtilityType, dateRange],
    queryFn: () => fetchUtilityBills(propertyId),
    enabled: !!propertyId
  });

  // Get utility usage data over time for charts
  const getUtilityUsageData = (utilityType: UtilityType) => {
    return utilityBills
      .filter(bill => bill.utilityType === utilityType && bill.usageQuantity)
      .sort((a, b) => new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime())
      .map(bill => ({
        period: `${new Date(bill.periodStart).toLocaleDateString(undefined, { month: 'short' })}`,
        usage: bill.usageQuantity,
        cost: bill.totalAmount
      }));
  };

  // Get utility cost data over time for charts
  const getUtilityCostData = () => {
    const costByType: Record<string, any[]> = {
      electricity: [],
      gas: [],
      water: [],
      other: []
    };
    
    // Group bills by month and utility type
    utilityBills.forEach(bill => {
      const month = new Date(bill.periodStart).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      const existingEntry = costByType[bill.utilityType].find(entry => entry.month === month);
      
      if (existingEntry) {
        existingEntry.cost += bill.totalAmount;
      } else {
        costByType[bill.utilityType].push({
          month,
          cost: bill.totalAmount
        });
      }
    });
    
    // Convert to format suitable for charts
    const monthsSet = new Set<string>();
    Object.values(costByType).forEach(typeData => {
      typeData.forEach(entry => monthsSet.add(entry.month));
    });
    
    const months = Array.from(monthsSet).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
    
    return months.map(month => {
      const entry: Record<string, any> = { month };
      Object.entries(costByType).forEach(([type, data]) => {
        const matchingEntry = data.find(item => item.month === month);
        entry[type] = matchingEntry ? matchingEntry.cost : 0;
      });
      return entry;
    });
  };

  // Detect anomalies in utility data
  const detectAnomalies = () => {
    // Group bills by utility type
    const billsByType: Record<UtilityType, UtilityBill[]> = {
      electricity: [],
      gas: [],
      water: [],
      other: []
    };
    
    utilityBills.forEach(bill => {
      billsByType[bill.utilityType].push(bill);
    });
    
    const anomalies = [];
    
    // For each utility type, check for unusual patterns
    Object.entries(billsByType).forEach(([type, bills]) => {
      if (bills.length < 2) return;
      
      // Sort bills by date
      const sortedBills = [...bills].sort((a, b) => 
        new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
      );
      
      // Compare each bill with the previous one
      for (let i = 1; i < sortedBills.length; i++) {
        const currentBill = sortedBills[i];
        const previousBill = sortedBills[i - 1];
        
        // Check for cost increase
        if (currentBill.totalAmount > previousBill.totalAmount * 1.2) {
          anomalies.push({
            billId: currentBill.id,
            utilityType: currentBill.utilityType,
            anomalyType: 'cost_increase',
            severity: currentBill.totalAmount > previousBill.totalAmount * 1.5 ? 'high' : 'medium',
            description: `Cost increased by ${Math.round((currentBill.totalAmount / previousBill.totalAmount - 1) * 100)}% compared to previous bill`
          });
        }
        
        // Check for usage increase if usage data available
        if (currentBill.usageQuantity && previousBill.usageQuantity && 
            currentBill.usageQuantity > previousBill.usageQuantity * 1.3) {
          anomalies.push({
            billId: currentBill.id,
            utilityType: currentBill.utilityType,
            anomalyType: 'usage_increase',
            severity: currentBill.usageQuantity > previousBill.usageQuantity * 1.8 ? 'high' : 'medium',
            description: `Usage increased by ${Math.round((currentBill.usageQuantity / previousBill.usageQuantity - 1) * 100)}% compared to previous bill`
          });
        }
      }
    });
    
    return anomalies;
  };

  return {
    utilityBills,
    isLoadingBills,
    billsError,
    selectedUtilityType,
    setSelectedUtilityType,
    dateRange,
    setDateRange,
    refetchBills,
    getUtilityUsageData,
    getUtilityCostData,
    detectAnomalies
  };
};
