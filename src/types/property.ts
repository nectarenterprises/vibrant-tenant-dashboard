
export interface Property {
  id: string;
  name: string;
  address: string;
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
  image?: string;
}

export interface UtilityData {
  month: string;
  gasUsage?: number;
  gasCost?: number;
  waterUsage?: number;
  waterCost?: number;
  electricityUsage?: number;
  electricityCost?: number;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  type: 'rent' | 'maintenance' | 'inspection' | 'other';
  propertyId?: string;
  propertyName?: string;
}
