
export type UtilityType = 'electricity' | 'water' | 'gas';

export interface UtilityBillUpload {
  propertyId: string;
  utilityType: UtilityType;
  billDate: string;
  file: File;
}

export interface ExtractedUtilityData {
  utilityType: UtilityType;
  billDate: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  meterReference: string;
  usageQuantity?: number;
  usageUnit?: string;
}

export interface ConfidenceScores {
  utilityType: number;
  billDate: number;
  periodStart: number;
  periodEnd: number;
  totalAmount: number;
  meterReference: number;
  usageQuantity: number;
  usageUnit: number;
}
