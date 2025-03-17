
import { useState } from 'react';

export const useUtilityBills = (propertyId?: string) => {
  const [bills, setBills] = useState([]);
  const [isLoadingBills, setIsLoadingBills] = useState(false);

  // Return mock data for utility usage by type
  const getUtilityUsageData = (utilityType: string) => {
    return [];
  };

  // Return mock data for utility cost
  const getUtilityCostData = () => {
    return [];
  };

  return {
    bills,
    isLoadingBills,
    getUtilityUsageData,
    getUtilityCostData
  };
};
