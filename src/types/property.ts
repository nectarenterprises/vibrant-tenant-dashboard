export interface Property {
  id: string;
  name: string;
  address: string;
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
  image?: string;
  premisesSchedule?: string;
  incentives: Incentive[];
  createdAt?: string;
  updatedAt?: string;
  serviceChargeAmount?: number;
  utilityData?: UtilityData[];
  complianceStatus?: ComplianceStatus;
  leaseStart?: string;
  leaseType?: string;
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

export type DocumentType = 'lease' | 'utility' | 'compliance' | 'service-charge' | 'photo' | 'other' | 'correspondence' | 'tax' | 'insurance';

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  filePath: string;
  documentType: DocumentType;
  uploadDate: string;
  tags?: DocumentTag[];
  isFavorite?: boolean;
  version?: number;
  previousVersions?: {
    version: number;
    uploadDate: string;
    filePath: string;
    notes?: string;
  }[];
  expiryDate?: string;
  keyDates?: {
    commencement?: string;
    expiry?: string;
    breakOption?: string[];
    rentReview?: string[];
  };
  notificationPeriod?: number; // in days
  lastAccessed?: string;
  versionNotes?: string;
  notes?: string; // Added notes property to fix DocumentVersion issue
}

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

export interface ComplianceStatus {
  fireRiskAssessment: ComplianceItem;
  electricalSafety: ComplianceItem;
  gasInspection: ComplianceItem;
  buildingInsurance: ComplianceItem;
  asbestosReport: ComplianceItem;
  energyPerformance: ComplianceItem;
  [key: string]: ComplianceItem;
}

export interface ComplianceItem {
  lastCompleted: string;
  nextDue: string;
  status: 'completed' | 'upcoming' | 'overdue';
  certificates?: ComplianceCertificate[];
}

export interface ComplianceCertificate {
  id: string;
  name: string;
  date: string;
  fileUrl: string;
}
