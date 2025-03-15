
import { UtilityData } from '@/types/property';

// Mock data for utility data since we don't have the actual table
export const getMockUtilityData = (): UtilityData[] => {
  return [
    {
      month: '2023-01',
      gasUsage: 120,
      gasCost: 85,
      waterUsage: 5,
      waterCost: 30,
      electricityUsage: 350,
      electricityCost: 70
    },
    {
      month: '2023-02',
      gasUsage: 110,
      gasCost: 78,
      waterUsage: 4.8,
      waterCost: 29,
      electricityUsage: 320,
      electricityCost: 65
    },
    {
      month: '2023-03',
      gasUsage: 90,
      gasCost: 65,
      waterUsage: 5.2,
      waterCost: 31,
      electricityUsage: 340,
      electricityCost: 68
    }
  ];
};

export const getMockPropertyUtilityData = (propertyId: string): UtilityData[] => {
  return [
    {
      month: '2023-01',
      gasUsage: 120,
      gasCost: 85,
      waterUsage: 5,
      waterCost: 30,
      electricityUsage: 350,
      electricityCost: 70
    },
    {
      month: '2023-02',
      gasUsage: 110,
      gasCost: 78,
      waterUsage: 4.8,
      waterCost: 29,
      electricityUsage: 320,
      electricityCost: 65
    },
    {
      month: '2023-03',
      gasUsage: 90,
      gasCost: 65,
      waterUsage: 5.2,
      waterCost: 31,
      electricityUsage: 340,
      electricityCost: 68
    }
  ];
};
