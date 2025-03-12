
export interface Property {
  id: string;
  name: string;
  address: string;
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
  image?: string;
  premisesSchedule?: string;
  incentives?: Incentive[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Incentive {
  type: 'rent-free' | 'fitout' | 'break-option' | 'other';
  description: string;
  value?: number;
  period?: string;
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

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  filePath: string;
  documentType: 'lease' | 'utility' | 'compliance' | 'service-charge' | 'other';
  uploadDate: string;
}
