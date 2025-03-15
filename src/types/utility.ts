
import { DocumentTag, DocumentType } from '@/types/property';
import { FolderType } from '@/services/document/types';

export type UtilityType = 'electricity' | 'gas' | 'water' | 'other';

export interface UtilityBill {
  id: string;
  propertyId: string;
  userId: string;
  utilityType: UtilityType;
  billDate: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  usageQuantity?: number;
  usageUnit?: string;
  meterReference?: string;
  rateInformation?: {
    baseRate?: number;
    standingCharge?: number;
    taxes?: number;
    [key: string]: any;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UtilityBillDocument {
  id: string;
  utilityBillId: string;
  documentId: string;
  isOriginal: boolean;
  createdAt: string;
}

export interface UtilityDataExtraction {
  id: string;
  documentId: string;
  extractionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  extractedData?: Partial<UtilityBill>;
  confidenceScores?: Record<string, number>;
  extractionDate: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface UtilityBillAnomaly {
  id: string;
  utilityBillId: string;
  anomalyType: 'usage_increase' | 'cost_increase' | 'unusual_pattern' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: string;
  resolved?: boolean;
  resolvedAt?: string;
  notes?: string;
}

export interface UtilityBillUpload {
  file: File;
  propertyId: string;
  utilityType?: UtilityType;
  billDate?: string;
  notes?: string;
}

export interface ExtractedUtilityData {
  utilityType: UtilityType;
  billDate: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  usageQuantity?: number;
  usageUnit?: string;
  meterReference?: string;
  rateInformation?: {
    baseRate?: number;
    standingCharge?: number;
    taxes?: number;
    [key: string]: any;
  };
}

export interface ConfidenceScores {
  utilityType: number;
  billDate: number;
  periodStart: number;
  periodEnd: number;
  totalAmount: number;
  usageQuantity?: number;
  usageUnit?: number;
  meterReference?: number;
  rateInformation?: number;
}

export interface ProcessingResult {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  documentId: string;
}
